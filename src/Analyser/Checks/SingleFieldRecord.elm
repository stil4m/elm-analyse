module Analyser.Checks.SingleFieldRecord exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Node as Node exposing (Node(..))
import Elm.Syntax.Range exposing (Range)
import Elm.Syntax.TypeAnnotation exposing (RecordDefinition, TypeAnnotation(..))


type alias Context =
    { whitelisted : List Range
    , matches : List ( Range, RecordDefinition )
    }


checker : Checker
checker =
    { check = scan
    , info =
        { key = "SingleFieldRecord"
        , name = "Single Field Record"
        , description = "Using a record is obsolete if you only plan to store a single field in it."
        , schema =
            Schema.schema
                |> Schema.rangeProp "range"
        }
    }


realMatches : Context -> List ( Range, RecordDefinition )
realMatches { matches, whitelisted } =
    List.filter (\m -> not <| List.member (Tuple.first m) whitelisted) matches


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    Inspector.inspect
        { defaultConfig | onTypeAnnotation = Post onTypeAnnotation }
        fileContext.ast
        { whitelisted = [], matches = [] }
        |> realMatches
        |> List.filter (Tuple.second >> isSingleFieldRecord)
        |> List.map Tuple.first
        |> List.map
            (\r ->
                Data.init
                    (String.concat
                        [ "Record has only one field. Use the field's type or introduce a Type. At "
                        , Range.rangeToString r
                        ]
                    )
                    |> Data.addRange "range" r
            )


isSingleFieldRecord : RecordDefinition -> Bool
isSingleFieldRecord x =
    List.length x == 1


onTypeAnnotation : Node TypeAnnotation -> Context -> Context
onTypeAnnotation ((Node _ t) as x) context =
    let
        newWhitelisted =
            case t of
                Typed _ ws ->
                    ws
                        |> List.filter
                            (\(Node _ ta) ->
                                case ta of
                                    Record _ ->
                                        True

                                    _ ->
                                        False
                            )
                        |> List.map Node.range
                        |> (++) context.whitelisted

                _ ->
                    context.whitelisted
    in
    { context
        | matches = findPlainRecords x ++ context.matches
        , whitelisted = newWhitelisted
    }


findPlainRecords : Node TypeAnnotation -> List ( Range, RecordDefinition )
findPlainRecords (Node r x) =
    case x of
        Record fields ->
            [ ( r, fields ) ]

        _ ->
            []

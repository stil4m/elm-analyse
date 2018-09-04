module Analyser.Checks.MultiLineRecordFormatting exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Node as Node exposing (Node(..))
import Elm.Syntax.Range as Syntax exposing (Range)
import Elm.Syntax.TypeAlias exposing (TypeAlias)
import Elm.Syntax.TypeAnnotation exposing (RecordDefinition, RecordField, TypeAnnotation(..))


checker : Checker
checker =
    { check = scan
    , info =
        { key = "MultiLineRecordFormatting"
        , name = "MultiLine Record Formatting"
        , description = "Records in type aliases should be formatted on multiple lines to help the reader."
        , schema =
            Schema.schema
                |> Schema.rangeProp "range"
        }
    }


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    let
        threshold =
            2
    in
    Inspector.inspect
        { defaultConfig | onTypeAlias = Post onTypeAlias }
        fileContext.ast
        []
        |> List.filter (Tuple.second >> List.length >> (<=) threshold)
        |> List.filterMap (\( range, fields ) -> firstTwo fields |> Maybe.map (\b -> ( range, b )))
        |> List.filter (Tuple.second >> fieldsOnSameLine)
        |> List.map (Tuple.first >> buildMessageData)


buildMessageData : Range -> MessageData
buildMessageData r =
    Data.init
        (String.concat
            [ "Record should be formatted over multiple lines at "
            , Range.rangeToString r
            ]
        )
        |> Data.addRange "range" r


fieldsOnSameLine : ( RecordField, RecordField ) -> Bool
fieldsOnSameLine ( left, right ) =
    (typeAnnotationRange (Tuple.second left)).start.row == (typeAnnotationRange (Tuple.second right)).start.row


firstTwo : RecordDefinition -> Maybe ( RecordField, RecordField )
firstTwo def =
    case def of
        (Node _ x) :: (Node _ y) :: _ ->
            Just ( x, y )

        _ ->
            Nothing


onTypeAlias : Node TypeAlias -> List ( Range, RecordDefinition ) -> List ( Range, RecordDefinition )
onTypeAlias (Node _ x) context =
    findRecords x.typeAnnotation ++ context


typeAnnotationRange : Node TypeAnnotation -> Syntax.Range
typeAnnotationRange (Node r _) =
    r


findRecords : Node TypeAnnotation -> List ( Range, RecordDefinition )
findRecords (Node r x) =
    case x of
        GenericType _ ->
            []

        Typed _ args ->
            List.concatMap findRecords args

        Unit ->
            []

        Tupled inner ->
            List.concatMap findRecords inner

        GenericRecord _ fields ->
            ( r, Node.value fields ) :: List.concatMap (Node.value >> Tuple.second >> findRecords) (Node.value fields)

        Record fields ->
            ( r, fields ) :: List.concatMap (Node.value >> Tuple.second >> findRecords) fields

        FunctionTypeAnnotation left right ->
            findRecords left ++ findRecords right

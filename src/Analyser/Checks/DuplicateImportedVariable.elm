module Analyser.Checks.DuplicateImportedVariable exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Dict exposing (Dict)
import Elm.Syntax.Exposing exposing (Exposing(..), TopLevelExpose(..))
import Elm.Syntax.Import exposing (Import)
import Elm.Syntax.ModuleName exposing (ModuleName)
import Elm.Syntax.Node as Node exposing (Node(..))
import Elm.Syntax.Range as Syntax


checker : Checker
checker =
    { check = scan
    , info =
        { key = "DuplicateImportedVariable"
        , name = "Duplicate Imported Variable"
        , description = "Importing a variable twice from the same module is noise. Remove this."
        , schema =
            Schema.schema
                |> Schema.rangeListProp "ranges"
                |> Schema.varProp "varName"
                |> Schema.moduleProp "moduleName"
        }
    }


type alias Context =
    { constructors : Dict ModuleName (Dict String (List Syntax.Range))
    , functionOrValues : Dict ModuleName (Dict String (List Syntax.Range))
    }


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    let
        result =
            Inspector.inspect
                { defaultConfig
                    | onImport = Post onImport
                    , onFunction = Skip
                }
                fileContext.ast
                { constructors = Dict.empty, functionOrValues = Dict.empty }
    in
    (findViolations result.functionOrValues ++ findViolations result.constructors)
        |> List.map asMessageData


asMessageData : ( ModuleName, String, List Syntax.Range ) -> MessageData
asMessageData ( a, b, rs ) =
    Data.init
        (String.concat
            [ "Variable `"
            , b
            , "` imported multiple times module `"
            , String.join "." a
            , "` at [ "
            , String.join " | " (List.map Range.rangeToString rs)
            , " ]"
            ]
        )
        |> Data.addModuleName "moduleName" a
        |> Data.addVarName "varName" b
        |> Data.addRanges "ranges" rs


findViolations : Dict ModuleName (Dict String (List Syntax.Range)) -> List ( ModuleName, String, List Syntax.Range )
findViolations d =
    d
        |> Dict.toList
        |> List.concatMap (\( m, e ) -> Dict.toList e |> List.map (\( n, rs ) -> ( m, n, rs )))
        |> List.filter (\( _, _, rs ) -> List.length rs >= 2)


onImport : Node Import -> Context -> Context
onImport (Node _ imp) context =
    let
        ( cs, vs ) =
            constructorsAndValues imp
    in
    { context
        | constructors = Dict.update (Node.value imp.moduleName) (Maybe.withDefault Dict.empty >> mergeImportedValue cs >> Just) context.constructors
        , functionOrValues =
            Dict.update (Node.value imp.moduleName)
                (Maybe.withDefault Dict.empty >> mergeImportedValue vs >> Just)
                context.functionOrValues
    }


mergeImportedValue : List (Node String) -> Dict String (List Syntax.Range) -> Dict String (List Syntax.Range)
mergeImportedValue l entry =
    let
        addPair (Node v k) d =
            Dict.update k
                (\old ->
                    old
                        |> Maybe.map ((::) v)
                        |> Maybe.withDefault [ v ]
                        |> Just
                )
                d
    in
    List.foldl addPair entry l


constructorsAndValues : Import -> ( List (Node String), List (Node String) )
constructorsAndValues imp =
    ( []
    , case imp.exposingList of
        Nothing ->
            []

        Just (Node _ (All _)) ->
            []

        Just (Node _ (Explicit xs)) ->
            List.map exposingValues xs
    )


exposingValues : Node TopLevelExpose -> Node String
exposingValues (Node r t) =
    Node r <|
        case t of
            TypeExpose s ->
                s.name

            InfixExpose s ->
                s

            FunctionExpose s ->
                s

            TypeOrAliasExpose s ->
                s

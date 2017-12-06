module Analyser.Checks.DuplicateImportedVariable exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(Post, Skip), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Dict exposing (Dict)
import Elm.Syntax.Base exposing (ModuleName)
import Elm.Syntax.Exposing exposing (Exposing(..), TopLevelExpose(..))
import Elm.Syntax.Module exposing (Import)
import Elm.Syntax.Range as Syntax
import Elm.Syntax.Ranged exposing (Ranged)


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


onImport : Import -> Context -> Context
onImport imp context =
    let
        ( cs, vs ) =
            constructorsAndValues imp
    in
    { context
        | constructors = Dict.update imp.moduleName (Maybe.withDefault Dict.empty >> mergeImportedValue cs >> Just) context.constructors
        , functionOrValues =
            Dict.update imp.moduleName
                (Maybe.withDefault Dict.empty >> mergeImportedValue vs >> Just)
                context.functionOrValues
    }


mergeImportedValue : List (Ranged String) -> Dict String (List Syntax.Range) -> Dict String (List Syntax.Range)
mergeImportedValue l entry =
    let
        addPair ( v, k ) d =
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


constructorsAndValues : Import -> ( List (Ranged String), List (Ranged String) )
constructorsAndValues imp =
    case imp.exposingList of
        Nothing ->
            ( [], [] )

        Just (All _) ->
            ( [], [] )

        Just (Explicit xs) ->
            ( List.concatMap exposingConstructors xs
            , List.map exposingValues xs
            )


exposingValues : Ranged TopLevelExpose -> Ranged String
exposingValues ( r, t ) =
    (,) r <|
        case t of
            TypeExpose s ->
                s.name

            InfixExpose s ->
                s

            FunctionExpose s ->
                s

            TypeOrAliasExpose s ->
                s


exposingConstructors : Ranged TopLevelExpose -> List (Ranged String)
exposingConstructors ( _, t ) =
    case t of
        TypeExpose s ->
            case s.constructors of
                Just (Explicit xs) ->
                    xs

                _ ->
                    []

        _ ->
            []

module Analyser.Checks.DuplicateImportedVariable exposing (checker)

import ASTUtil.Inspector as Inspector exposing (Order(Post, Skip), defaultConfig)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Range as Range exposing (RangeContext)
import Analyser.Messages.Types exposing (Message, MessageData(DuplicateImportedVariable), newMessage)
import Dict exposing (Dict)
import Elm.Syntax.Base exposing (ModuleName)
import Elm.Syntax.Exposing exposing (Exposing(..), TopLevelExpose(..))
import Elm.Syntax.Module exposing (Import)
import Elm.Syntax.Range as Syntax


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "DuplicateImportedVariable" ]
    , key = "DuplicateImportedVariable"
    , name = "Duplicate Imported Variable"
    , description = "Importing a variable twice from the same module is noise. Remove this."
    }


type alias Context =
    { constructors : Dict ModuleName (Dict String (List Syntax.Range))
    , functionOrValues : Dict ModuleName (Dict String (List Syntax.Range))
    }


scan : RangeContext -> FileContext -> Configuration -> List Message
scan rangeContext fileContext _ =
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
        |> List.map (asMessageData rangeContext fileContext.path)
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


asMessageData : RangeContext -> String -> ( ModuleName, String, List Syntax.Range ) -> MessageData
asMessageData rangeContext path ( a, b, rs ) =
    DuplicateImportedVariable path a b (List.map (Range.build rangeContext) rs)


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


mergeImportedValue : List ( String, Syntax.Range ) -> Dict String (List Syntax.Range) -> Dict String (List Syntax.Range)
mergeImportedValue l entry =
    let
        addPair ( k, v ) d =
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


constructorsAndValues : Import -> ( List ( String, Syntax.Range ), List ( String, Syntax.Range ) )
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


exposingValues : TopLevelExpose -> ( String, Syntax.Range )
exposingValues t =
    case t of
        TypeExpose s ->
            ( s.name, s.range )

        InfixExpose s r ->
            ( s, r )

        FunctionExpose s r ->
            ( s, r )

        TypeOrAliasExpose s r ->
            ( s, r )


exposingConstructors : TopLevelExpose -> List ( String, Syntax.Range )
exposingConstructors t =
    case t of
        TypeExpose s ->
            case s.constructors of
                Just (Explicit xs) ->
                    xs

                _ ->
                    []

        _ ->
            []

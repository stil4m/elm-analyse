module Analyser.Checks.DuplicateImport exposing (checker)

import ASTUtil.Inspector as Inspector exposing (Order(Post, Skip), defaultConfig)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Range as Range exposing (Range, RangeContext)
import Analyser.Messages.Types exposing (Message, MessageData(DuplicateImport), newMessage)
import Dict exposing (Dict)
import Elm.Syntax.Base exposing (ModuleName)
import Elm.Syntax.Module exposing (Import)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "DuplicateImport" ]
    , key = "DuplicateImport"
    , name = "Duplicate Import"
    , description = "You are importing the same module twice."
    }


type alias Context =
    Dict ModuleName (List Range)


scan : RangeContext -> FileContext -> Configuration -> List Message
scan rangeContext fileContext _ =
    Inspector.inspect
        { defaultConfig
            | onImport = Post (onImport rangeContext)
            , onFunction = Skip
        }
        fileContext.ast
        Dict.empty
        |> Dict.filter (always (hasLength ((<) 1)))
        |> Dict.toList
        |> List.map (uncurry (DuplicateImport fileContext.path))
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


hasLength : (Int -> Bool) -> List a -> Bool
hasLength f =
    List.length >> f


onImport : RangeContext -> Import -> Context -> Context
onImport rangeContext { moduleName, range } context =
    case Dict.get moduleName context of
        Just _ ->
            Dict.update moduleName (Maybe.map (flip (++) [ Range.build rangeContext range ])) context

        Nothing ->
            Dict.insert moduleName [ Range.build rangeContext range ] context

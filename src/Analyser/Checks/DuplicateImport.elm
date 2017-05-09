module Analyser.Checks.DuplicateImport exposing (checker)

import Elm.Syntax.Base exposing (ModuleName)
import Elm.Syntax.Module exposing (Import)
import Elm.Syntax.Range exposing (Range)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message, MessageData(DuplicateImport), newMessage)
import ASTUtil.Inspector as Inspector exposing (Order(Post, Skip), defaultConfig)
import Dict exposing (Dict)
import Analyser.Configuration exposing (Configuration)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "DuplicateImport" ]
    }


type alias Context =
    Dict ModuleName (List Range)


scan : FileContext -> Configuration -> List Message
scan fileContext _ =
    Inspector.inspect
        { defaultConfig
            | onImport = Post onImport
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


onImport : Import -> Context -> Context
onImport { moduleName, range } context =
    case Dict.get moduleName context of
        Just _ ->
            Dict.update moduleName (Maybe.map (flip (++) [ range ])) context

        Nothing ->
            Dict.insert moduleName [ range ] context

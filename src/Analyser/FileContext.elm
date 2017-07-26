module Analyser.FileContext exposing (FileContext, build)

import Analyser.Files.Types exposing (LoadedSourceFile)
import Elm.Interface as Interface exposing (Interface)
import Elm.Syntax.Base exposing (ModuleName)
import Elm.Syntax.File exposing (File)
import Elm.Processing as Processing exposing (ProcessContext)
import Elm.RawFile as RawFile
import Analyser.CodeBase as CodeBase exposing (CodeBase)


type alias FileContext =
    { interface : Interface
    , moduleName : Maybe ModuleName
    , ast : File
    , content : String
    , path : String
    , sha1 : String
    , formatted : Bool
    }


build : CodeBase -> List LoadedSourceFile -> List FileContext
build codeBase selected =
    let
        moduleIndex =
            CodeBase.processContext codeBase
    in
        List.filterMap (buildForFile moduleIndex) selected


buildForFile : ProcessContext -> LoadedSourceFile -> Maybe FileContext
buildForFile moduleIndex ( fileContent, r ) =
    case r of
        Err _ ->
            Nothing

        Ok l ->
            Just <|
                { moduleName = RawFile.moduleName l
                , ast = Processing.process moduleIndex l
                , path = fileContent.path
                , content = fileContent.content |> Maybe.withDefault ""
                , interface = Interface.build l
                , sha1 = Maybe.withDefault "" fileContent.sha1
                , formatted = fileContent.formatted
                }

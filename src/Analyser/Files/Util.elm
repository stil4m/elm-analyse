module Analyser.Files.Util exposing (isLoaded, withLoaded, fileLoadError)

import Analyser.Files.Types exposing (FileLoad(Failed, Loaded), LoadedFileData)


isLoaded : FileLoad -> Bool
isLoaded =
    not << (==) Nothing << withLoaded


fileLoadError : FileLoad -> Maybe String
fileLoadError x =
    case x of
        Failed e ->
            Just e

        _ ->
            Nothing


withLoaded : FileLoad -> Maybe LoadedFileData
withLoaded x =
    case x of
        Loaded y ->
            Just y

        _ ->
            Nothing

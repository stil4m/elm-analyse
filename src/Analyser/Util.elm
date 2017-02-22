module Analyser.Util exposing (isLoaded, withLoaded)

import Analyser.Files.Types exposing (FileLoad(Loaded), LoadedFileData)


isLoaded : FileLoad -> Bool
isLoaded =
    not << (==) Nothing << withLoaded


withLoaded : FileLoad -> Maybe LoadedFileData
withLoaded x =
    case x of
        Loaded y ->
            Just y

        _ ->
            Nothing

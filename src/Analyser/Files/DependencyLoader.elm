module Analyser.Files.DependencyLoader exposing (Model, Msg, getDependency, init, isDone, subscriptions, update)

import Analyser.DependencyHandler as DependencyHandler exposing (CacheDependencyRead(..), DependencyPointer)
import Elm.Dependency exposing (Dependency)
import Json.Decode as JD
import Util.Logger as Logger


type alias Model =
    { dependency : DependencyPointer
    , state : State
    }


type State
    = AwaitingCache
    | LoadingOnlineDocs
    | RawDiskLoading
    | Failure
    | Done Dependency


type Msg
    = OnCacheRead CacheDependencyRead
    | OnOnlineDocs (Maybe (Result JD.Error Dependency))
    | OnLocallyBuildDependency (Maybe (Result String Dependency))


init : DependencyPointer -> ( Model, Cmd Msg )
init dep =
    ( { dependency = dep, state = AwaitingCache }
    , Cmd.batch
        [ DependencyHandler.readFromDisk dep
        , Logger.info ("Load dependency " ++ dep.name ++ " " ++ dep.version)
        ]
    )


isDone : Model -> Bool
isDone m =
    case m.state of
        Failure ->
            True

        Done _ ->
            True

        _ ->
            False


getDependency : Model -> Maybe Dependency
getDependency m =
    case m.state of
        Done d ->
            Just d

        _ ->
            Nothing


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnCacheRead read ->
            case read of
                Success result ->
                    ( { model | state = Done <| result }
                    , Logger.info ("Loaded " ++ model.dependency.name ++ " from cache")
                    )

                Failed ->
                    ( { model | state = LoadingOnlineDocs }
                    , DependencyHandler.loadOnlineDocumentation model.dependency
                    )

                Ignore ->
                    ( model
                    , Cmd.none
                    )

        OnOnlineDocs result ->
            case result of
                Nothing ->
                    ( model, Cmd.none )

                Just (Err _) ->
                    ( { model | state = RawDiskLoading }
                    , DependencyHandler.loadDependencyFiles model.dependency
                    )

                Just (Ok decodedDependency) ->
                    ( { model | state = Done decodedDependency }
                    , Cmd.batch
                        [ DependencyHandler.storeToDisk decodedDependency
                        , Logger.info ("Loaded " ++ model.dependency.name ++ " from package.elm-lang.org")
                        ]
                    )

        OnLocallyBuildDependency result ->
            case result of
                Nothing ->
                    ( model, Cmd.none )

                Just (Err _) ->
                    ( { model | state = Failure }
                    , Logger.info ("Failed to load dependency: " ++ model.dependency.name)
                    )

                Just (Ok decodedDependency) ->
                    ( { model | state = Done decodedDependency }
                    , Cmd.batch
                        [ DependencyHandler.storeToDisk decodedDependency
                        , Logger.info ("Loaded " ++ model.dependency.name ++ " by building dependency from plain source files")
                        ]
                    )


subscriptions : Model -> Sub Msg
subscriptions model =
    case model.state of
        AwaitingCache ->
            DependencyHandler.onReadFromDisk model.dependency
                |> Sub.map OnCacheRead

        Failure ->
            Sub.none

        Done _ ->
            Sub.none

        LoadingOnlineDocs ->
            DependencyHandler.onOnlineDocumentation model.dependency
                |> Sub.map OnOnlineDocs

        RawDiskLoading ->
            DependencyHandler.onLoadDependencyFilesFromDisk model.dependency
                |> Sub.map OnLocallyBuildDependency

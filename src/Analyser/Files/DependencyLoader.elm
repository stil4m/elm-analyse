module Analyser.Files.DependencyLoader exposing (Model, Msg, getDependency, init, isDone, subscriptions, update)

import Analyser.DependencyHandler as DependencyHandler exposing (CacheDependencyRead(..))
import Analyser.Files.Types exposing (Version)
import Elm.Dependency exposing (Dependency)
import Util.Logger as Logger


type alias Model =
    { dep : ( String, Version )
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
    | OnOnlineDocs (Maybe (Result String Dependency))
    | OnLocallyBuildDependency (Maybe (Result String Dependency))


init : ( String, Version ) -> ( Model, Cmd Msg )
init (( name, version ) as dep) =
    ( { dep = dep, state = AwaitingCache }
    , Cmd.batch
        [ DependencyHandler.readFromDisk dep
        , Logger.info ("Load dependency " ++ name ++ " " ++ version)
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
                    , Logger.info ("Loaded " ++ Tuple.first model.dep ++ " from cache")
                    )

                Failed ->
                    ( { model | state = LoadingOnlineDocs }
                    , DependencyHandler.loadOnlineDocumentation model.dep
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
                    , DependencyHandler.loadDependencyFiles model.dep
                    )

                Just (Ok decodedDependency) ->
                    ( { model | state = Done decodedDependency }
                    , Cmd.batch
                        [ DependencyHandler.storeToDisk decodedDependency
                        , Logger.info ("Loaded " ++ Tuple.first model.dep ++ " from package.elm-lang.org")
                        ]
                    )

        OnLocallyBuildDependency result ->
            case result of
                Nothing ->
                    ( model, Cmd.none )

                Just (Err _) ->
                    ( { model | state = Failure }
                    , Logger.info ("Failed to load dependency: " ++ Tuple.first model.dep)
                    )

                Just (Ok decodedDependency) ->
                    ( { model | state = Done decodedDependency }
                    , Cmd.batch
                        [ DependencyHandler.storeToDisk decodedDependency
                        , Logger.info ("Loaded " ++ Tuple.first model.dep ++ " by building depenceny from plain source files")
                        ]
                    )


subscriptions : Model -> Sub Msg
subscriptions model =
    case model.state of
        AwaitingCache ->
            DependencyHandler.onReadFromDisk model.dep
                |> Sub.map OnCacheRead

        Failure ->
            Sub.none

        Done _ ->
            Sub.none

        LoadingOnlineDocs ->
            DependencyHandler.onOnlineDocumentation model.dep
                |> Sub.map OnOnlineDocs

        RawDiskLoading ->
            DependencyHandler.onLoadDependencyFilesFromDisk model.dep
                |> Sub.map OnLocallyBuildDependency

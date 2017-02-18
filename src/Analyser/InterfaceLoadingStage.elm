module Analyser.InterfaceLoadingStage exposing (Model, Msg, init, isDone, getDependencies, update, subscriptions)

import Analyser.Files.DependencyLoader as DependencyLoader
import Analyser.Files.Types exposing (Dependency, Version)
import Dict exposing (Dict)
import Tuple2


type Model
    = Model State


type Msg
    = DependencyLoaderMsg ( String, Version ) DependencyLoader.Msg


type alias State =
    { dependencyLoaders : Dict ( String, Version ) DependencyLoader.Model
    , loadedDependencies : List (Result String Dependency)
    }


getDependencies : Model -> List Dependency
getDependencies (Model state) =
    state.loadedDependencies |> List.filterMap (Result.toMaybe)


init : List ( String, Version ) -> ( Model, Cmd Msg )
init input =
    let
        loaders : List ( ( String, Version ), ( DependencyLoader.Model, Cmd DependencyLoader.Msg ) )
        loaders =
            List.map (\x -> ( x, DependencyLoader.init x )) input

        cmds =
            loaders
                |> List.map (Tuple2.mapSecond Tuple.second)
                |> List.map (\( p, v ) -> v |> Cmd.map (DependencyLoaderMsg p))
                |> Cmd.batch

        dependencyLoaders : Dict ( String, Version ) DependencyLoader.Model
        dependencyLoaders =
            loaders |> List.map (Tuple2.mapSecond Tuple.first) |> Dict.fromList
    in
        ( Model
            { dependencyLoaders = dependencyLoaders
            , loadedDependencies = []
            }
        , cmds
        )


subscriptions : Model -> Sub Msg
subscriptions (Model model) =
    model.dependencyLoaders
        |> Dict.toList
        |> List.map (\( k, v ) -> DependencyLoader.subscriptions v |> Sub.map (DependencyLoaderMsg k))
        |> Sub.batch


isDone : Model -> Bool
isDone (Model model) =
    Dict.isEmpty model.dependencyLoaders


update : Msg -> Model -> ( Model, Cmd Msg )
update msg (Model state) =
    case msg of
        DependencyLoaderMsg pair subMsg ->
            Dict.get pair state.dependencyLoaders
                |> Maybe.map (DependencyLoader.update subMsg)
                |> Maybe.map
                    (\( loader, cmds ) ->
                        ( Model <|
                            case DependencyLoader.getResult loader of
                                Nothing ->
                                    { state | dependencyLoaders = Dict.insert pair loader state.dependencyLoaders }

                                Just result ->
                                    { state
                                        | dependencyLoaders = Dict.remove pair state.dependencyLoaders
                                        , loadedDependencies = result :: state.loadedDependencies
                                    }
                        , cmds |> Cmd.map (DependencyLoaderMsg pair)
                        )
                    )
                |> Maybe.withDefault ( Model state, Cmd.none )

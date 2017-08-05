module Analyser.DependencyLoadingStage exposing (Model, Msg, getDependencies, init, isDone, subscriptions, update)

import Analyser.Files.DependencyLoader as DependencyLoader
import Analyser.Files.Types exposing (Version)
import Elm.Dependency exposing (Dependency)


type Model
    = Model State


type Msg
    = DependencyLoaderMsg DependencyLoader.Msg


type alias State =
    { queue : List ( String, Version )
    , activeLoader : Maybe DependencyLoader.Model
    , loadedDependencies : List (Result String Dependency)
    }


getDependencies : Model -> List Dependency
getDependencies (Model state) =
    state.loadedDependencies |> List.filterMap Result.toMaybe


init : List ( String, Version ) -> ( Model, Cmd Msg )
init input =
    ( Model
        { queue = input
        , activeLoader = Nothing
        , loadedDependencies = []
        }
    , Cmd.none
    )
        |> loadNextDependency


loadNextDependency : ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
loadNextDependency (( Model m, cmds ) as input) =
    if m.activeLoader /= Nothing then
        input
    else
        let
            nextLoaderPair =
                List.head m.queue
                    |> Maybe.map DependencyLoader.init
        in
        ( Model
            { m
                | queue = List.drop 1 m.queue
                , activeLoader = Maybe.map Tuple.first nextLoaderPair
            }
        , Cmd.batch
            [ cmds
            , nextLoaderPair
                |> Maybe.map (Tuple.second >> Cmd.map DependencyLoaderMsg)
                |> Maybe.withDefault Cmd.none
            ]
        )


subscriptions : Model -> Sub Msg
subscriptions (Model model) =
    model.activeLoader
        |> Maybe.map (DependencyLoader.subscriptions >> Sub.map DependencyLoaderMsg)
        |> Maybe.withDefault Sub.none


isDone : Model -> Bool
isDone (Model model) =
    model.activeLoader == Nothing && List.isEmpty model.queue


update : Msg -> Model -> ( Model, Cmd Msg )
update msg (Model state) =
    case msg of
        DependencyLoaderMsg subMsg ->
            state.activeLoader
                |> Maybe.map (DependencyLoader.update subMsg)
                |> Maybe.map
                    (\( loader, cmds ) ->
                        case DependencyLoader.getResult loader of
                            Nothing ->
                                ( Model { state | activeLoader = Just loader }
                                , cmds |> Cmd.map DependencyLoaderMsg
                                )

                            Just result ->
                                ( Model
                                    { state
                                        | loadedDependencies = result :: state.loadedDependencies
                                        , activeLoader = Nothing
                                    }
                                , cmds |> Cmd.map DependencyLoaderMsg
                                )
                                    |> loadNextDependency
                    )
                |> Maybe.withDefault ( Model state, Cmd.none )

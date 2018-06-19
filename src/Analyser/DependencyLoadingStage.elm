module Analyser.DependencyLoadingStage exposing (Model, Msg, getDependencies, init, isDone, subscriptions, update)

import Analyser.Files.DependencyLoader as DependencyLoader
import Analyser.Files.Types exposing (Version)
import Dict exposing (Dict)
import Elm.Dependency exposing (Dependency)


type alias Model =
    Dict String DependencyLoader.Model


type Msg
    = DependencyLoaderMsg String DependencyLoader.Msg


getDependencies : Model -> List Dependency
getDependencies model =
    model
        |> Dict.values
        |> List.filterMap DependencyLoader.getDependency


init : List ( String, Version ) -> ( Model, Cmd Msg )
init input =
    let
        inits : List ( String, ( DependencyLoader.Model, Cmd DependencyLoader.Msg ) )
        inits =
            List.map (\( s, v ) -> ( s, DependencyLoader.init ( s, v ) )) input
    in
    ( List.map (\( a, ( b, _ ) ) -> ( a, b )) inits
        |> Dict.fromList
    , List.map (\( a, ( _, c ) ) -> c |> Cmd.map (DependencyLoaderMsg a)) inits
        |> Cmd.batch
    )


subscriptions : Model -> Sub Msg
subscriptions model =
    model
        |> Dict.toList
        |> List.map (\( name, l ) -> DependencyLoader.subscriptions l |> Sub.map (DependencyLoaderMsg name))
        |> Sub.batch


isDone : Model -> Bool
isDone model =
    model |> Dict.values |> List.all DependencyLoader.isDone


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        DependencyLoaderMsg name subMsg ->
            let
                loader =
                    Dict.get name model
            in
            case loader of
                Nothing ->
                    ( model, Cmd.none )

                Just l ->
                    let
                        ( newLoader, cmds ) =
                            DependencyLoader.update subMsg l
                    in
                    ( Dict.insert name newLoader model
                    , Cmd.map (DependencyLoaderMsg name) cmds
                    )

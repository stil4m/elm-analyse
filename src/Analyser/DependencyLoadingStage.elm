module Analyser.DependencyLoadingStage exposing (Model, Msg, getDependencies, init, isDone, subscriptions, update)

import Analyser.Files.DependencyLoader as DependencyLoader
import Dict exposing (Dict)
import Elm.Constraint
import Elm.Dependency exposing (Dependency)
import Elm.Package
import Elm.Project as Elm
import Elm.Version


type alias Model =
    Dict String DependencyLoader.Model


type Msg
    = DependencyLoaderMsg String DependencyLoader.Msg


getDependencies : Model -> List Dependency
getDependencies model =
    model
        |> Dict.values
        |> List.filterMap DependencyLoader.getDependency


init : Elm.Project -> ( Model, Cmd Msg )
init elmProject =
    let
        inits : List ( String, ( DependencyLoader.Model, Cmd DependencyLoader.Msg ) )
        inits =
            elmProject
                |> collectDependencies
                |> List.map (\( s, v ) -> ( s, DependencyLoader.init { name = s, version = v } ))
    in
    ( List.map (\( a, ( b, _ ) ) -> ( a, b )) inits
        |> Dict.fromList
    , List.map (\( a, ( _, c ) ) -> c |> Cmd.map (DependencyLoaderMsg a)) inits
        |> Cmd.batch
    )


collectDependencies : Elm.Project -> List ( String, String )
collectDependencies p =
    case p of
        Elm.Application appInfo ->
            appInfo.depsDirect
                |> List.map (Tuple.mapFirst Elm.Package.toString)
                |> List.map (Tuple.mapSecond Elm.Version.toString)

        Elm.Package packageInfo ->
            packageInfo.deps
                |> List.map (Tuple.mapFirst Elm.Package.toString)
                |> List.map
                    (Tuple.mapSecond
                        (Elm.Constraint.toString
                            >> String.split " "
                            >> List.head
                            >> Maybe.withDefault (Elm.Version.toString Elm.Version.one)
                        )
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

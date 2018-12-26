module Client.DependenciesPage exposing (view)

import Analyser.State exposing (State)
import Analyser.State.Dependencies exposing (DependencyInfo, VersionState(..))
import Client.State
import Dict
import Html exposing (Html)
import Html.Attributes
import Registry.Version as Version


view : Client.State.State -> Html msg
view state =
    Client.State.view state <| viewState


viewState : State -> Html msg
viewState state =
    Html.div []
        [ Html.h3 [] [ Html.text "Project Dependencies" ]
        , Html.table [ Html.Attributes.class "table table-condensed" ]
            [ Html.tbody []
                (Dict.toList state.dependencies.values
                    |> List.map (Tuple.second >> viewDependency state.dependencies.unused)
                )
            ]
        ]


dependencyLink : String -> String -> Html.Attribute msg
dependencyLink name version =
    Html.Attributes.href <|
        ("http://package.elm-lang.org/packages/" ++ name ++ "/" ++ version)


viewDependency : List String -> DependencyInfo -> Html msg
viewDependency unusedDeps depInfo =
    let
        newerDependencies =
            case Version.fromString depInfo.dependency.version of
                Nothing ->
                    []

                Just current ->
                    depInfo.package
                        |> Maybe.map .versions
                        |> Maybe.map (List.filter (\v -> Version.order current v == Basics.LT))
                        |> Maybe.withDefault []
    in
    Html.tr []
        [ Html.td [ Html.Attributes.class "col-md-3 col-sm-4" ]
            [ depStatus unusedDeps depInfo
            ]
        , Html.td [ Html.Attributes.class "col-md-5 col-sm-6" ]
            [ Html.a [ dependencyLink depInfo.dependency.name depInfo.dependency.version, Html.Attributes.target "_blank" ]
                [ Html.text depInfo.dependency.name
                , Html.text "@"
                , Html.text depInfo.dependency.version
                ]
            ]
        , Html.td []
            [ if List.isEmpty newerDependencies then
                Html.span [] []

              else
                Html.div []
                    [ Html.p [] [ Html.strong [] [ Html.text "Newer dependencies:" ] ]
                    , Html.ul []
                        (List.map
                            (\v ->
                                Html.li []
                                    [ Html.a
                                        [ dependencyLink depInfo.dependency.name (Version.asString v)
                                        , Html.Attributes.target "_blank"
                                        ]
                                        [ Html.text <| Version.asString v ]
                                    ]
                            )
                            newerDependencies
                        )
                    ]
            ]
        ]


depStatus : List String -> DependencyInfo -> Html msg
depStatus unused depInfo =
    if List.member depInfo.dependency.name unused then
        Html.span [ Html.Attributes.style "color" "#d9534f" ]
            [ Html.i [ Html.Attributes.class "fa fa-exclamation-circle" ] []
            , Html.text " Unused"
            ]

    else
        case depInfo.versionState of
            UpToDate ->
                Html.span [ Html.Attributes.style "color" "#5cb85c" ]
                    [ Html.i [ Html.Attributes.class "fa fa-check-circle" ] []
                    , Html.text " Up to date"
                    ]

            MajorBehind ->
                Html.span [ Html.Attributes.style "color" "#f0ad4e" ]
                    [ Html.i [ Html.Attributes.class "fa fa-exclamation-circle" ] []
                    , Html.text " New major"
                    ]

            Upgradable ->
                Html.span [ Html.Attributes.style "color" "#f0ad4e" ]
                    [ Html.i [ Html.Attributes.class "fa fa-dot-circle-o" ] []
                    , Html.text " Upgradable"
                    ]

            Unknown ->
                Html.span [ Html.Attributes.style "color" "#5bc0de" ]
                    [ Html.i [ Html.Attributes.class "fa fa-question-circle-o" ] []
                    , Html.text " Unknown"
                    ]

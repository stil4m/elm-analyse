module Docs.Home exposing (view)

import Docs.Html as DocsHtml
import Docs.Page as Page exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)


view : Html msg
view =
    div [ style [ ( "margin-bottom", "60px" ) ] ]
        [ div
            [ class "jumbotron" ]
            [ div
                [ class "container" ]
                [ h1
                    [ class "display-3" ]
                    [ text "Elm Analyse" ]
                , p
                    []
                    [ text "Static code analyser for the Elm programming language"
                    ]
                ]
            ]
        , div [ class "container" ]
            [ div []
                [ h1 [] [ text "What is it?" ]
                , p [] [ text "A tool that allows you to analyse your Elm code, identify deficiencies and apply best practices." ]
                , p []
                    [ code [] [ text "elm-analyse" ]
                    , text " does this by looking at the code in your project determine the structure and parsing the files."
                    , text " "
                    , text "You can find out more on this in the "
                    , a [ href (Page.hash Features) ] [ text "Features" ]
                    , text " and "
                    , a [ href (Page.hash (Messages Nothing)) ] [ text "Checks" ]
                    , text " sections."
                    ]
                ]
            , hr [] []
            , div []
                [ h1 [] [ text "Installation Guide" ]
                , text "Prerequisites:"
                , ul []
                    [ li [] [ code [] [ text "node >= 6" ] ]
                    , li [] [ code [] [ text "elm-format" ] ]
                    ]
                , text "The installation can easily be installed running one of the following commandos:"
                , DocsHtml.pre
                    [ text """npm install -g elm-install
yarn global add elm-analyse""" ]
                ]
            , hr [] []
            , div []
                [ h1 [] [ text "Run" ]
                , p [] [ text "You can run elm-analyse in either in the command line or as a server. The server option will give you the option to browse through the messages (either by file or the whole list) and fix these automatically. Additionally the server mode will allow you to see the inter module dependencies." ]
                , h3 [] [ text "Command line" ]
                , p []
                    [ DocsHtml.pre
                        [ text "elm-analyse" ]
                    ]
                , h3 [] [ text "GUI mode" ]
                , p []
                    [ DocsHtml.pre
                        [ text "elm-analyse -s" ]
                    ]
                , p [] [ text "The command line does also allow additional options:" ]
                , table
                    [ class "table table-condensed" ]
                    [ tbody []
                        [ tr []
                            [ td [] [ code [] [ text "--help or -h" ] ]
                            , td [] [ text "Print the help output." ]
                            ]
                        , tr []
                            [ td [] [ code [] [ text "--server or -s" ] ]
                            , td [] [ text "Enable server mode. Disabled by default." ]
                            ]
                        , tr []
                            [ td [] [ code [] [ text "--port or -p" ] ]
                            , td [] [ text "The port on which the server should listen. Defaults to 3000 (", code [] [ text "--port=3000" ], text ")." ]
                            ]
                        , tr []
                            [ td [] [ code [] [ text "--elm-format-path" ] ]
                            , td [] [ text "Path to elm-format. Defaults to ", code [] [ text "elm-format" ], text "." ]
                            ]
                        , tr []
                            [ td [] [ code [] [ text "--version or -v" ] ]
                            , td [] [ text "Print version of software." ]
                            ]
                        ]
                    ]
                , p []
                    [ text "To furter configure elm-analyse, please look into the "
                    , a [ href (Page.hash Configuration) ] [ text "Configuration" ]
                    , text " section."
                    ]
                ]
            , hr [] []
            , h1 [] [ text "Contribution and Issues" ]
            , p []
                [ text "If you encounter issues, want to contribute or have suggestions for features or new checks, please report these via the issue tracker on "
                , a [ href "https://github.com/stil4m/elm-analyse", target "_blank" ] [ text "GitHub" ]
                , text "."
                ]
            ]
        ]

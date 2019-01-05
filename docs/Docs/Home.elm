module Docs.Home exposing (view)

import Docs.Html as DocsHtml
import Docs.Page as Page
import Html exposing (Html)
import Html.Attributes


view : Html msg
view =
    Html.div [ Html.Attributes.style "margin-bottom" "60px" ]
        [ Html.div
            [ Html.Attributes.class "jumbotron" ]
            [ Html.div
                [ Html.Attributes.class "container" ]
                [ Html.h1
                    [ Html.Attributes.class "display-3" ]
                    [ Html.text "Elm Analyse" ]
                , Html.p
                    []
                    [ Html.text "Static code analyser for the Elm programming language"
                    ]
                ]
            ]
        , Html.div [ Html.Attributes.class "container" ]
            [ Html.div []
                [ Html.h1 [] [ Html.text "What is it?" ]
                , Html.p [] [ Html.text "A tool that allows you to analyse your Elm code, identify deficiencies and apply best practices." ]
                , Html.p []
                    [ Html.code [] [ Html.text "elm-analyse" ]
                    , Html.text " does this by looking at the code in your project determine the structure and parsing the files."
                    , Html.text " "
                    , Html.text "You can find out more on this in the "
                    , Html.a [ Html.Attributes.href (Page.hash (Page.Features Nothing)) ] [ Html.text "Features" ]
                    , Html.text " and "
                    , Html.a [ Html.Attributes.href (Page.hash (Page.Messages Nothing)) ] [ Html.text "Checks" ]
                    , Html.text " sections."
                    ]
                ]
            , Html.hr [] []
            , Html.div []
                [ Html.h1 [] [ Html.text "Installation Guide" ]
                , Html.text "Prerequisites:"
                , Html.ul []
                    [ Html.li [] [ Html.code [] [ Html.text "node >= 6" ] ]
                    , Html.li [] [ Html.code [] [ Html.text "elm-format" ] ]
                    ]
                , Html.text "The installation can easily be installed running one of the following commandos:"
                , DocsHtml.pre
                    [ Html.text """npm install -g elm-analyse""" ]
                , DocsHtml.pre
                    [ Html.text """yarn global add elm-analyse""" ]
                ]
            , Html.hr [] []
            , Html.div []
                [ Html.h1 [] [ Html.text "Run" ]
                , Html.p [] [ Html.text "You can run elm-analyse in either in the command line or as a server. The server option will give you the option to browse through the messages (either by file or the whole list) and fix these automatically. Additionally the server mode will allow you to see the inter module dependencies." ]
                , Html.h3 [] [ Html.text "Command line" ]
                , Html.p []
                    [ DocsHtml.pre
                        [ Html.text "elm-analyse" ]
                    ]
                , Html.h3 [] [ Html.text "GUI mode" ]
                , Html.p []
                    [ DocsHtml.pre
                        [ Html.text "elm-analyse -s" ]
                    ]
                , Html.p [] [ Html.text "The command line does also allow additional options:" ]
                , Html.table
                    [ Html.Attributes.class "table table-condensed" ]
                    [ Html.tbody []
                        [ Html.tr []
                            [ Html.td [] [ Html.code [] [ Html.text "--help or -h" ] ]
                            , Html.td [] [ Html.text "Print the help output." ]
                            ]
                        , Html.tr []
                            [ Html.td [] [ Html.code [] [ Html.text "--server or -s" ] ]
                            , Html.td [] [ Html.text "Enable server mode. Disabled by default." ]
                            ]
                        , Html.tr []
                            [ Html.td [] [ Html.code [] [ Html.text "--port or -p" ] ]
                            , Html.td [] [ Html.text "The port on which the server should listen. Defaults to 3000 (", Html.code [] [ Html.text "--port=3000" ], Html.text ")." ]
                            ]
                        , Html.tr []
                            [ Html.td [] [ Html.code [] [ Html.text "--open or -o" ] ]
                            , Html.td [] [ Html.text "Open default browser when server goes live." ]
                            ]
                        , Html.tr []
                            [ Html.td [] [ Html.code [] [ Html.text "--elm-format-path" ] ]
                            , Html.td [] [ Html.text "Path to elm-format. Defaults to ", Html.code [] [ Html.text "elm-format" ], Html.text "." ]
                            ]
                        , Html.tr []
                            [ Html.td [] [ Html.code [] [ Html.text "--version or -v" ] ]
                            , Html.td [] [ Html.text "Print version of software." ]
                            ]
                        , Html.tr []
                            [ Html.td [] [ Html.code [] [ Html.text "--format" ] ]
                            , Html.td [] [ Html.text "Format which elm-analyse writes to standard out. Valid values are either 'human' or 'json'. This will default to 'human'." ]
                            ]
                        ]
                    ]
                , Html.p []
                    [ Html.text "To furter configure elm-analyse, please look into the "
                    , Html.a [ Html.Attributes.href (Page.hash Page.Configuration) ] [ Html.text "Configuration" ]
                    , Html.text " section."
                    ]
                ]
            , Html.hr [] []
            , Html.h1 [] [ Html.text "Contribution and Issues" ]
            , Html.p []
                [ Html.text "If you encounter issues, want to contribute or have suggestions for features or new checks, please report these via the issue tracker on "
                , Html.a [ Html.Attributes.href "https://github.com/stil4m/elm-analyse", Html.Attributes.target "_blank" ] [ Html.text "GitHub" ]
                , Html.text "."
                ]
            ]
        ]

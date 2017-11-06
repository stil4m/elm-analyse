module Docs.Features exposing (view)

import Docs.Html as DocsHtml
import Html exposing (..)
import Html.Attributes exposing (..)


view : Html msg
view =
    DocsHtml.content
        [ h1 [] [ text "Features" ]
        , hr [] []
        , resolvingIssues
        , hr [] []
        , packageCycles
        , hr [] []
        , editorIntegration
        , hr [] []
        , moduleGraph
        ]


resolvingIssues : Html msg
resolvingIssues =
    div []
        [ h2 [] [ text "Resolving Issues" ]
        , div [ class "row" ]
            [ div [ class "col" ]
                [ p []
                    [ text "Elm analyse reports issues via the command line interface or via a web GUI. "
                    , text "However, the web GUI also allows you to automaticall resolve some of the check violations."
                    ]
                , p []
                    [ text "Not all checks can be resolved automatically, we need your expertise for that, but the others can be fixed with a click of a button."
                    ]
                , p []
                    [ text "Additionally we will format the fixed file using elm-format to make sure that the outputted file does not contain any weird spacing."
                    ]
                ]
            , div [ class "col col-5 col-sm-6 col-md-8" ]
                [ div [ class "row" ]
                    [ div [ class "col col-md-6 col-sm-12 col-12" ]
                        [ a
                            [ href "https://raw.githubusercontent.com/stil4m/elm-analyse/master/images/terminal-output.png"
                            , target "_blank"
                            ]
                            [ img [ class "img-fluid", src "https://raw.githubusercontent.com/stil4m/elm-analyse/master/images/terminal-output.png" ] []
                            ]
                        ]
                    , div [ class "col  col-md-6 col-sm-12 col-12" ]
                        [ a
                            [ href "https://raw.githubusercontent.com/stil4m/elm-analyse/master/images/dashboard.png"
                            , target "_blank"
                            ]
                            [ img [ class "img-fluid", src "https://raw.githubusercontent.com/stil4m/elm-analyse/master/images/dashboard.png" ] [] ]
                        ]
                    , div [ class "col-12" ]
                        [ a
                            [ href "https://raw.githubusercontent.com/stil4m/elm-analyse/master/images/single-message.png"
                            , target "_blank"
                            ]
                            [ img [ class "img-fluid", src "https://raw.githubusercontent.com/stil4m/elm-analyse/master/images/single-message.png" ] [] ]
                        ]
                    ]
                ]
            ]
        ]


packageCycles : Html msg
packageCycles =
    div []
        [ h2 [] [ text "Package Cycles" ]
        , i [] [ text "Documentation is coming soon" ]
        ]


editorIntegration : Html msg
editorIntegration =
    div []
        [ h2 [] [ text "Editor Integration" ]
        , i [] [ text "Documentation is coming soon" ]
        ]


moduleGraph : Html msg
moduleGraph =
    div []
        [ h2 [] [ text "Modules" ]
        , p [] [ text "The list of top importees and importers shows you the modules in the analysed code base that import the most modules and that are imported the most." ]
        , p [] [ text "Reducing the centrality of individual modules can be beneficial for a few reasons:" ]
        , ul []
            [ li [] [ text "It makes individual modules more re-usable by requiring fewer imports" ]
            , li [] [ text "It speeds up development as it can reduce the compile time as fewer modules will be affected by changes." ]
            , li [] [ text "It groups related functions together and makes them easier to understand and read." ]
            ]
        , div [ class "row" ]
            [ div [ class "col" ]
                [ h4 [] [ text "Top importees" ]
                , p [] [ text "A list of modules being imported the most. These modules are the most \"popular\" in your code base. This might be the result of modules taking up too many responsibilites. To reduce the number of imports of a specific module you may:" ]
                , ul []
                    [ li [] [ text "Split type definitions and function operating with these into separate modules." ]
                    , li [] [ text "Separate related functions into sub-modules to allow callsites to import only the most appropriate part of the code." ]
                    ]
                ]
            , div [ class "col" ]
                [ h4 [] [ text "Top importers" ]
                , p [] [ text "Typical candidates are your app's update function. These usually import many sub modules. These modules tend to become very powerful. Again you can try to reduce the number of imports by trying to delegate function subroutines to separate modules. This makes sense if individual functions are responsible for multiple imports." ]
                ]
            ]
        ]

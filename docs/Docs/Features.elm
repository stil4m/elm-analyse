module Docs.Features exposing (view)

import Docs.Html as DocsHtml
import Html exposing (Html)
import Html.Attributes


view : Html msg
view =
    DocsHtml.content
        [ Html.h1 [] [ Html.text "Features" ]
        , Html.hr [] []
        , resolvingIssues
        , Html.hr [] []
        , packageCycles
        , Html.hr [] []
        , editorIntegration
        , Html.hr [] []
        , moduleGraph
        , Html.hr [] []
        , dependencyInformation
        ]


resolvingIssues : Html msg
resolvingIssues =
    Html.div []
        [ Html.h2 [] [ Html.text "Resolving Issues" ]
        , Html.div [ Html.Attributes.class "row" ]
            [ Html.div [ Html.Attributes.class "col" ]
                [ Html.p []
                    [ Html.text "Elm analyse reports issues via the command line interface or via a web GUI. "
                    , Html.text "However, the web GUI also allows you to automaticall resolve some of the check violations."
                    ]
                , Html.p []
                    [ Html.text "Not all checks can be resolved automatically, we need your expertise for that, but the others can be fixed with a click of a button."
                    ]
                , Html.p []
                    [ Html.text "Additionally we will format the fixed file using elm-format to make sure that the outputted file does not contain any weird spacing."
                    ]
                ]
            , Html.div [ Html.Attributes.class "col col-5 col-sm-6 col-md-8" ]
                [ Html.div [ Html.Attributes.class "row" ]
                    [ Html.div [ Html.Attributes.class "col col-md-6 col-sm-12 col-12" ]
                        [ Html.a
                            [ Html.Attributes.href "https://raw.githubusercontent.com/stil4m/elm-analyse/master/images/terminal-output.png"
                            , Html.Attributes.target "_blank"
                            ]
                            [ Html.img [ Html.Attributes.class "img-fluid", Html.Attributes.src "https://raw.githubusercontent.com/stil4m/elm-analyse/master/images/terminal-output.png" ] []
                            ]
                        ]
                    , Html.div [ Html.Attributes.class "col  col-md-6 col-sm-12 col-12" ]
                        [ Html.a
                            [ Html.Attributes.href "https://raw.githubusercontent.com/stil4m/elm-analyse/master/images/dashboard.png"
                            , Html.Attributes.target "_blank"
                            ]
                            [ Html.img [ Html.Attributes.class "img-fluid", Html.Attributes.src "https://raw.githubusercontent.com/stil4m/elm-analyse/master/images/dashboard.png" ] [] ]
                        ]
                    , Html.div [ Html.Attributes.class "col-12" ]
                        [ Html.a
                            [ Html.Attributes.href "https://raw.githubusercontent.com/stil4m/elm-analyse/master/images/single-message.png"
                            , Html.Attributes.target "_blank"
                            ]
                            [ Html.img [ Html.Attributes.class "img-fluid", Html.Attributes.src "https://raw.githubusercontent.com/stil4m/elm-analyse/master/images/single-message.png" ] [] ]
                        ]
                    ]
                ]
            ]
        ]


packageCycles : Html msg
packageCycles =
    Html.div []
        [ Html.h2 [] [ Html.text "Package Cycles" ]
        , Html.i [] [ Html.text "Documentation is coming soon" ]
        ]


editorIntegration : Html msg
editorIntegration =
    Html.div []
        [ Html.h2 [] [ Html.text "Editor Integration" ]
        , Html.i [] [ Html.text "Documentation is coming soon" ]
        ]


moduleGraph : Html msg
moduleGraph =
    Html.div []
        [ Html.h2 [] [ Html.text "Modules" ]
        , Html.p [] [ Html.text "The list of top importees and importers shows you the modules in the analysed code base that import the most modules and that are imported the most." ]
        , Html.p [] [ Html.text "Reducing the centrality of individual modules can be beneficial for a few reasons:" ]
        , Html.ul []
            [ Html.li [] [ Html.text "It makes individual modules more re-usable by requiring fewer imports" ]
            , Html.li [] [ Html.text "It speeds up development as it can reduce the compile time as fewer modules will be affected by changes." ]
            , Html.li [] [ Html.text "It groups related functions together and makes them easier to understand and read." ]
            ]
        , Html.div [ Html.Attributes.class "row" ]
            [ Html.div [ Html.Attributes.class "col" ]
                [ Html.h4 [ Html.Attributes.id "top-importees" ] [ Html.text "Top importees" ]
                , Html.p [] [ Html.text "A list of modules being imported the most. These modules are the most \"popular\" in your code base. This might be the result of modules taking up too many responsibilites. To reduce the number of imports of a specific module you may:" ]
                , Html.ul []
                    [ Html.li [] [ Html.text "Split type definitions and function operating with these into separate modules." ]
                    , Html.li [] [ Html.text "Separate related functions into sub-modules to allow callsites to import only the most appropriate part of the code." ]
                    ]
                ]
            , Html.div [ Html.Attributes.class "col" ]
                [ Html.h4 [ Html.Attributes.id "top-importers" ] [ Html.text "Top importers" ]
                , Html.p [] [ Html.text "Typical candidates are your app's update function. These usually import many sub modules. These modules tend to become very powerful. Again you can try to reduce the number of imports by trying to delegate function subroutines to separate modules. This makes sense if individual functions are responsible for multiple imports." ]
                ]
            ]
        ]


dependencyInformation : Html msg
dependencyInformation =
    Html.div []
        [ Html.h2 [] [ Html.text "Dependency Information" ]
        , Html.div [ Html.Attributes.class "row" ]
            [ Html.div [ Html.Attributes.class "col" ]
                [ Html.p []
                    [ Html.text "Dependencies may evolve and you may start to use your dependencies differently than before. "
                    , Html.text "Elm Analyser will help you get insight into this."
                    ]
                , Html.p []
                    [ Html.text "Firstly, the elm-analyse checker will exit with a non-zero exit code when you have dependencies specified in your elm.json that you do not use."
                    ]
                , Html.p []
                    [ Html.text "Secondly, the GUI will show in a simple table what the state of your dependencies are."
                    ]
                ]
            , Html.div [ Html.Attributes.class "col col-5 col-sm-6 col-md-8" ]
                [ Html.div [ Html.Attributes.class "row" ]
                    [ Html.div [ Html.Attributes.class "col-12" ]
                        [ Html.a
                            [ Html.Attributes.href "https://raw.githubusercontent.com/stil4m/elm-analyse/master/images/dependency-info.png"
                            , Html.Attributes.target "_blank"
                            ]
                            [ Html.img [ Html.Attributes.class "img-fluid", Html.Attributes.src "https://raw.githubusercontent.com/stil4m/elm-analyse/master/images/dependency-info.png" ] [] ]
                        ]
                    ]
                ]
            ]
        ]

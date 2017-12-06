module Docs.Configuration exposing (..)

import Docs.Html as DocsHtml
import Docs.Page as Page exposing (..)
import Html exposing (..)
import Html.Attributes exposing (class, href)


view : Html a
view =
    DocsHtml.content
        [ h1 [] [ text "Configuration" ]
        , p [] [ text "At this moment you can configure the checks that are included in the analysis by disabling or enabling them in a configuration file." ]
        , p []
            [ text "By default all checks are enabled. To disable checks, add an "
            , code [] [ text "elm-analyse.json" ]
            , text " file to the root of the Elm project (besides elm-package.json)."
            ]
        , p []
            [ text "An example configuration to disable the "
            , code [] [ text "UnusedTypeAlias" ]
            , text " check is presented below."
            ]
        , DocsHtml.pre
            [ text """{
    "checks" : {
        "UnusedTypeAlias": false
    }
}"""
            ]
        , p [] [ i [] [ text "Note: In the future different checks will be configurable. Please make suggestions for these configurations via issues." ] ]
        , p []
            [ text "The keys in the checks configuration match the keys in the "
            , a [ href (Page.hash (Messages Nothing)) ] [ text "Checks" ]
            , text " section."
            ]
        , hr [] []
        , h2 [] [ text "Check Specific configuration" ]
        , p []
            [ text "Check specific configuration can be added to the "
            , code [] [ text "elm-analyse.json" ]
            , text " file in the following manner:\n\n"
            ]
        , DocsHtml.pre
            [ text """{
    ...
    "<CheckName>" : {
        "<property>": <value>
    },
    ...
}"""
            ]
        , p [] [ text "The configurable options are:" ]
        , table [ class "table table-bordered table-sm" ]
            [ thead []
                [ tr []
                    [ th [] [ text "Check" ]
                    , th [] [ text "Property" ]
                    , th [] [ text "Description" ]
                    , th [] [ text "Default value" ]
                    ]
                ]
            , tbody []
                (List.map configuratonPropertyRow configurationProperties)
            ]
        , hr [] []
        , h2 [] [ text "Ignore Paths" ]
        , p []
            [ text "It is possible to exclude specific paths and files in the analysis with the following configuration in "
            , code [] [ text "elm-analyse.json" ]
            , text ":"
            ]
        , DocsHtml.pre [ text """{
    ...
    "excludedPaths" : [
        "src/Vendor",
        "src/App/FileThatShouldNotBeInspected.elm"
    ],
    ...
}
""" ]
        ]


configuratonPropertyRow : ConfigurationProperty -> Html msg
configuratonPropertyRow x =
    tr []
        [ td [] [ code [] [ text x.check ] ]
        , td [] [ code [] [ text x.property ] ]
        , td [] [ text x.description ]
        , td [] [ code [] [ text x.defaultValue ] ]
        ]


type alias ConfigurationProperty =
    { check : String
    , property : String
    , description : String
    , defaultValue : String
    }


configurationProperties : List ConfigurationProperty
configurationProperties =
    [ { check = "TriggerWords"
      , property = "words"
      , description = "Array of words that would trigger a violation."
      , defaultValue = "[ \"todo\" ]"
      }
    ]

module Docs.Configuration exposing (view)

import Docs.Html as DocsHtml
import Docs.Page as Page
import Html exposing (Html)
import Html.Attributes exposing (class, href)


view : Html a
view =
    DocsHtml.content
        [ Html.h1 [] [ Html.text "Configuration" ]
        , Html.p [] [ Html.text "At this moment you can configure the checks that are included in the analysis by disabling or enabling them in a configuration file." ]
        , Html.p []
            [ Html.text "By default all checks are enabled. To disable checks, add an "
            , Html.code [] [ Html.text "elm-analyse.json" ]
            , Html.text " file to the root of the Elm project (beside elm.json)."
            ]
        , Html.p []
            [ Html.text "An example configuration to disable the "
            , Html.code [] [ Html.text "UnusedTypeAlias" ]
            , Html.text " check is presented below."
            ]
        , DocsHtml.pre
            [ Html.text """{
    "checks" : {
        "UnusedTypeAlias": false
    }
}"""
            ]
        , Html.p [] [ Html.i [] [ Html.text "Note: In the future different checks will be configurable. Please make suggestions for these configurations via issues." ] ]
        , Html.p []
            [ Html.text "The keys in the checks configuration match the keys in the "
            , Html.a [ href (Page.hash (Page.Messages Nothing)) ] [ Html.text "Checks" ]
            , Html.text " section."
            ]
        , Html.hr [] []
        , Html.h2 [] [ Html.text "Check Specific configuration" ]
        , Html.p []
            [ Html.text "Check specific configuration can be added to the "
            , Html.code [] [ Html.text "elm-analyse.json" ]
            , Html.text " file in the following manner:\n\n"
            ]
        , DocsHtml.pre
            [ Html.text """{
    ...
    "<CheckName>" : {
        "<property>": <value>
    },
    ...
}"""
            ]
        , Html.p [] [ Html.text "The configurable options are:" ]
        , Html.table [ class "table table-bordered table-sm" ]
            [ Html.thead []
                [ Html.tr []
                    [ Html.th [] [ Html.text "Check" ]
                    , Html.th [] [ Html.text "Property" ]
                    , Html.th [] [ Html.text "Description" ]
                    , Html.th [] [ Html.text "Default value" ]
                    ]
                ]
            , Html.tbody []
                (List.map configuratonPropertyRow configurationProperties)
            ]
        , Html.hr [] []
        , Html.h2 [] [ Html.text "Ignore Paths" ]
        , Html.p []
            [ Html.text "It is possible to exclude specific paths and files in the analysis with the following configuration in "
            , Html.code [] [ Html.text "elm-analyse.json" ]
            , Html.text ":"
            ]
        , DocsHtml.pre [ Html.text """{
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
    Html.tr []
        [ Html.td [] [ Html.code [] [ Html.text x.check ] ]
        , Html.td [] [ Html.code [] [ Html.text x.property ] ]
        , Html.td [] [ Html.text x.description ]
        , Html.td [] [ Html.code [] [ Html.text x.defaultValue ] ]
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

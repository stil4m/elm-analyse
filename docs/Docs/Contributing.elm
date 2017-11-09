module Docs.Contributing exposing (view)

import Docs.Html as DocsHtml
import Html exposing (Html)
import Html.Attributes


view : Html a
view =
    DocsHtml.content
        [ Html.h1 [] [ Html.text "Contribution Guide" ]
        , Html.p []
            [ Html.text """
                Contributions are an important part of moving software forward.
                In this guide I would like to help you not only bringing Elm Analyse forward, but also in the right direction.
                I've listed a few points below that would help you get your contributions back into Elm Analyse.
                """
            ]
        , Html.h3 [] [ Html.text "Type of Contribution" ]
        , Html.p []
            [ Html.text """
                If you are making a contribution, be aware if you are fixing a bug, creating new functionality or changing existent things.
                Fixing bugs is easy, but making bigger changes may affect which release a change could be released.
                Please work with """
            , Html.a [ Html.Attributes.href "https://github.com/stil4m/elm-analyse/issues", Html.Attributes.target "_blank" ] [ Html.text "Issues" ]
            , Html.text " if you want to change 'bigger' things in Elm Analyse. Together we may come to new insights and fix things well in the first go."
            ]
        , Html.p []
            [ Html.text """
            In the solution the goal should always be to create a solution that works for 'everyone'.
            Especially in the early days of this tool I would want to avoid circumstantial and highly configurable functionality.
            For example a check such as "Unused variables" is always valid.
            Disabling checks for a Module, a function or a single expression, is something that should not be at the core of this tool.
            In my (@stil4m) honest opinion, thinking about how we can write quality Elm code (and implement this in Elm Analyse) would help the Elm community forward much more,
            than creating a tool that contains the exact same functionality as other linters (ESLint for example).
            """ ]
        , Html.h3 [] [ Html.text "Running the stack" ]
        , Html.p []
            [ Html.text "Elm Analyse consists of three parts: The server, the client and the documentation. These can all be started in dev mode with the following commands (in different terminals):"
            , DocsHtml.pre [ Html.text """npm install

npm run dev:server
npm run dev:client
npm run dev:docs""" ]
            ]
        , Html.h3 [] [ Html.text "Code Style" ]
        , Html.p [] [ Html.text "The following guidelines apply" ]
        , Html.ul []
            [ Html.li []
                [ Html.text "Format the elm code using the configured "
                , Html.code [] [ Html.text "elm-format" ]
                , Html.text "."
                ]
            , Html.li [] [ Html.text "Write JS conforming to the .editorconfig and ES Lint style configured in the repository." ]
            , Html.li [] [ Html.text "Format JS using prettier as configured in 'package.json'." ]
            , Html.li [] [ Html.text "Use modules to encapsulate data and bring data and functions close to each other. Write TEA modules for UI related components." ]
            ]
        , Html.h3 [] [ Html.text "The Pull Request" ]
        , Html.p []
            [ Html.text "Make pull requests based-on the "
            , simpleCode "master"
            , Html.text " branch of repository if the contain small bug fixes. Make pull requests based-on the "
            , simpleCode "dev"
            , Html.text " branch when you make bigger changes."
            ]
        , Html.p []
            [ Html.text """
                Please remove the following files from your pull request: 'docs/docs.js', 'js/backend-elm.js', 'js/public/client-elm.js'.
                All JS will be compiled before the release.
                The JS is tracked with Git to make sure Elm Analyse does not have to compile on the machines that install via npm.
                """
            ]
        ]


simpleCode : String -> Html msg
simpleCode t =
    Html.code [] [ Html.text t ]

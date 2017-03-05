module ASTInspector exposing (main)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)
import Parser.Parser as Parser
import AST.Types exposing (File)
import CssFrameworks
import CssFrameworks.Bootstrap
import AST.Encoding exposing (encode)
import Json.Encode as JE


main : Program Never Model Msg
main =
    beginnerProgram { model = model, view = view, update = update }


type Model
    = Model String (Maybe File)


type Msg
    = ChangeInput String


model : Model
model =
    Model "" Nothing


update : Msg -> Model -> Model
update msg _ =
    case msg of
        ChangeInput s ->
            Model s (Parser.parse s)


view : Model -> Html Msg
view (Model _ file) =
    div []
        [ CssFrameworks.toStyleNode CssFrameworks.Bootstrap.bootstrap
        , div [ class "container" ]
            [ div [ class "row" ]
                [ div [ class "col-md-6 col-sm-6" ]
                    [ textarea [ onInput ChangeInput, rows 40, cols 80 ] [] ]
                , div [ class "col-md-6 col-sm-6" ]
                    [ pre [] [ file |> Maybe.map (encode >> JE.encode 2) |> Maybe.withDefault "" |> text ] ]
                ]
            ]
        ]

port module SingleFileRead exposing (..)

import Platform exposing (program)
import Json.Encode as JE
import AST.Encoding
import Parser.Parser


port parsed : String -> Cmd msg


port newInput : (String -> msg) -> Sub msg


type alias Model =
    ()


type Msg
    = NewInput String


main : Program Never Model Msg
main =
    program { init = init, update = update, subscriptions = subscriptions }


init : ( Model, Cmd Msg )
init =
    ( ()
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NewInput input ->
            ( model
            , Parser.Parser.parse input
                |> Maybe.map (AST.Encoding.encode >> JE.encode 0)
                |> Maybe.withDefault ""
                |> parsed
            )


subscriptions : Model -> Sub Msg
subscriptions _ =
    newInput NewInput

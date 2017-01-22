module Main exposing (..)

import Parser
import Platform exposing (program)
import Ports
import Task
import Time


type alias Model =
    ()


type Msg
    = OnFileContent ( String, String )
    | Trigger String String Time.Time
    | Done String String Time.Time Time.Time


main : Program Never Model Msg
main =
    program { init = init, update = update, subscriptions = subscriptions }


init : ( Model, Cmd Msg )
init =
    () ! []


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnFileContent ( fileName, x ) ->
            ( ()
            , Time.now
                |> Task.perform (Trigger fileName x)
            )

        Trigger fileName content currentTime ->
            ( ()
            , Parser.parse content
                |> (\r ->
                        Time.now
                            |> Task.perform (Done fileName (toString <| r) currentTime)
                   )
            )

        Done fileName result before after ->
            ( ()
            , Ports.parseResponse ( fileName, result, after - before )
            )


subscriptions : a -> Sub Msg
subscriptions model =
    Ports.onFile OnFileContent

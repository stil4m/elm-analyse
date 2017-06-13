module Analyser.State exposing (..)

import Analyser.Messages.Types as Messages exposing (Message, MessageId, MessageStatus(Applicable))
import Analyser.Messages.Json exposing (encodeMessage, decodeMessage)
import Analyser.Messages.Util as Messages exposing (blockForShas, markFixing)
import Graph exposing (Graph)
import Graph.Json as Graph
import Graph.Node exposing (Node)
import Json.Encode as JE exposing (Value)
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra exposing ((|:))
import List.Extra as List


type alias State =
    { messages : List Message
    , idCount : Int
    , status : Status
    , queue : List Task
    , graph : Graph Node
    }


type alias Task =
    Int


type Status
    = Initialising
    | Fixing
    | Idle


initialState : State
initialState =
    { messages = []
    , idCount = 0
    , status = Initialising
    , queue = []
    , graph = Graph.empty
    }


isBusy : State -> Bool
isBusy s =
    case s.status of
        Idle ->
            False

        Initialising ->
            True

        Fixing ->
            False


getMessage : MessageId -> State -> Maybe Message
getMessage messageId =
    .messages >> List.filter (.id >> (==) messageId) >> List.head


nextTask : State -> Maybe ( State, MessageId )
nextTask state =
    case state.queue of
        [] ->
            Nothing

        x :: xs ->
            Just ( { state | queue = xs }, x )


addFixToQueue : Int -> State -> State
addFixToQueue m s =
    { s | queue = s.queue ++ [ m ] }


startFixing : Message -> State -> State
startFixing message state =
    { state
        | status = Fixing
        , messages =
            state.messages
                |> List.map (blockForShas (List.map Tuple.first message.files))
                |> List.map (markFixing message.id)
    }


sortMessages : State -> State
sortMessages state =
    { state
        | messages =
            state.messages
                |> List.sortWith Messages.compareMessageFile
                |> List.groupWhile (\a b -> Messages.messageFile a == Messages.messageFile b)
                |> List.concatMap (List.sortWith Messages.compareMessageLocation)
    }


removeMessagesForFile : String -> State -> State
removeMessagesForFile fileName state =
    { state | messages = List.filter (\m -> Messages.messageFile m /= fileName) state.messages }


outdateMessagesForFile : String -> State -> State
outdateMessagesForFile fileName state =
    { state
        | messages =
            state.messages
                |> List.map
                    (\m ->
                        if Messages.messageFile m == fileName then
                            Messages.outdate m
                        else
                            m
                    )
    }


finishWithNewMessages : List Message -> State -> State
finishWithNewMessages messages s =
    let
        --TODO, Can we miss something here?
        untouchedMessages =
            s.messages
                |> List.filter (.status >> (==) Applicable)

        messagesWithId =
            List.indexedMap (\n message -> { message | id = n + s.idCount }) messages
    in
        { s
            | messages = untouchedMessages ++ messagesWithId
            , status = Idle
            , idCount = s.idCount + List.length messages
        }
            |> sortMessages


updateGraph : Graph Node -> State -> State
updateGraph newGraph s =
    { s | graph = newGraph }


decodeState : Decoder State
decodeState =
    JD.succeed State
        |: JD.field "messages" (JD.list decodeMessage)
        |: JD.field "idCount" JD.int
        |: JD.field "status" decodeStatus
        |: JD.field "queue" (JD.list JD.int)
        |: JD.field "graph" Graph.decode


encodeState : State -> Value
encodeState state =
    JE.object
        [ ( "messages", JE.list (List.map encodeMessage state.messages) )
        , ( "idCount", JE.int state.idCount )
        , ( "status", encodeStatus state.status )
        , ( "queue", JE.list (List.map JE.int state.queue) )
        , ( "graph", Graph.encode state.graph )
        ]


decodeStatus : Decoder Status
decodeStatus =
    JD.andThen
        (\x ->
            case x of
                "initialising" ->
                    JD.succeed Initialising

                "idle" ->
                    JD.succeed Idle

                "fixing" ->
                    JD.succeed Fixing

                _ ->
                    JD.fail ("Could not decode status. got: " ++ x)
        )
        JD.string


encodeStatus : Status -> Value
encodeStatus s =
    case s of
        Initialising ->
            JE.string "initialising"

        Idle ->
            JE.string "idle"

        Fixing ->
            JE.string "fixing"

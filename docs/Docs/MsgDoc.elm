module Docs.MsgDoc exposing (allMessages, forKey, getMessage, view)

import Analyser.Checks.Base exposing (Checker, CheckerInfo)
import Analyser.Checks.BooleanCase
import Analyser.Checks.DebugCrash
import Analyser.Checks.DebugLog
import Analyser.Checks.DropConcatOfLists
import Analyser.Checks.DropConsOfItemAndList
import Analyser.Checks.DuplicateImport
import Analyser.Checks.DuplicateImportedVariable
import Analyser.Checks.ExposeAll
import Analyser.Checks.FileLoadFailed as FileLoadFailed
import Analyser.Checks.FunctionInLet
import Analyser.Checks.ImportAll
import Analyser.Checks.MapNothingToNothing
import Analyser.Checks.MultiLineRecordFormatting
import Analyser.Checks.NoTopLevelSignature
import Analyser.Checks.NoUncurriedPrefix
import Analyser.Checks.SingleFieldRecord
import Analyser.Checks.TriggerWords
import Analyser.Checks.UnnecessaryListConcat
import Analyser.Checks.UnnecessaryParens
import Analyser.Checks.UnnecessaryPortModule
import Analyser.Checks.UnusedImport
import Analyser.Checks.UnusedImportAlias
import Analyser.Checks.UnusedImportedVariable
import Analyser.Checks.UnusedPatternVariable
import Analyser.Checks.UnusedTopLevel
import Analyser.Checks.UnusedTypeAlias
import Analyser.Checks.UnusedValueConstructor
import Analyser.Checks.UnusedVariable
import Analyser.Checks.UseConsOverConcat
import Analyser.Configuration as Configuration exposing (Configuration)
import Analyser.FileContext as FileContext
import Analyser.FileRef exposing (FileRef)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Json as J
import Analyser.Messages.Schema as Schema
import Analyser.Messages.Types as M exposing (Message)
import Analyser.Messages.Util
import Client.Highlight
import Debug as SafeDebug
import Docs.Html as DocsHtml
import Docs.Page as Page exposing (Page(..))
import Elm.Interface as Interface
import Elm.Parser
import Elm.Processing as Processing
import Html exposing (Html)
import Html.Attributes
import Json.Encode


type MsgExample
    = Fixed Message
    | Dynamic Checker


type alias MsgDoc =
    { example : MsgExample
    , input : String
    , info : CheckerInfo
    }


allMessages : List MsgDoc
allMessages =
    [ functionInLet
    , unnecessaryPortModule
    , multiLineRecordFormatting
    , unnecessaryListConcat
    , dropConsOfItemAndList
    , dropConcatOfLists
    , useConsOverConcat
    , unusedImport
    , unusedImportAlias
    , noUncurriedPrefix
    , unusedTypeAlias
    , duplicateImportedVariable
    , duplicateImport
    , fileLoadFailed
    , booleanCase
    , debugCrash
    , debugLog
    , unnecessaryParens
    , noTopLevelSignature
    , exposeAll
    , unusedPatternVariable
    , unusedImportedVariable
    , unusedTopLevel
    , unusedVariable
    , importAll
    , singleFieldRecord
    , triggerWords
    , mapNothingToNothing
    , unusedValueConstructor
    ]


forKey : String -> Maybe MsgDoc
forKey x =
    allMessages
        |> List.filter (.info >> .key >> (==) x)
        |> List.head


unusedValueConstructor : MsgDoc
unusedValueConstructor =
    { info = .info Analyser.Checks.UnusedValueConstructor.checker
    , example = Dynamic Analyser.Checks.UnusedValueConstructor.checker
    , input = """
module Greet exposing (Color)

type Color
    = Blue
    | Red
    | Green

red = Red

blue = Blue
"""
    }


mapNothingToNothing : MsgDoc
mapNothingToNothing =
    { info = .info Analyser.Checks.MapNothingToNothing.checker
    , example = Dynamic Analyser.Checks.MapNothingToNothing.checker
    , input = """
module Greet exposing (greet)

greet x =
    case x of
        Nothing ->
            Nothing
        Just x ->
            "Hello " ++ x
"""
    }


triggerWords : MsgDoc
triggerWords =
    { info = .info Analyser.Checks.TriggerWords.checker
    , example = Dynamic Analyser.Checks.TriggerWords.checker
    , input = """
module Foo exposing (sum)

-- TODO actually implement this
sum : Int -> Int -> Int
sum x y =
    0
"""
    }


booleanCase : MsgDoc
booleanCase =
    { info = .info Analyser.Checks.BooleanCase.checker
    , example = Dynamic Analyser.Checks.BooleanCase.checker
    , input = """
module Foo exposing (sum)

thing : Boolean -> String
thing x =
    case x of
        True ->
            "Hello"
        False ->
            "Goodbye"
"""
    }


functionInLet : MsgDoc
functionInLet =
    { info = .info Analyser.Checks.FunctionInLet.checker
    , example = Dynamic Analyser.Checks.FunctionInLet.checker
    , input = """
port module Foo exposing (foo)

foo : Int -> Int
foo x =
    let
        somethingIShouldDefineOnTopLevel : Int -> Int
        somethingIShouldDefineOnTopLevel y =
            y + 1
    in
        somethingIShouldDefineOnTopLevel x
"""
    }


unnecessaryPortModule : MsgDoc
unnecessaryPortModule =
    { info = .info Analyser.Checks.UnnecessaryPortModule.checker
    , example = Dynamic Analyser.Checks.UnnecessaryPortModule.checker
    , input = """
port module Foo exposing (notAPort)

notAPort : Int
notAPort = 1
"""
    }


multiLineRecordFormatting : MsgDoc
multiLineRecordFormatting =
    { info = .info Analyser.Checks.MultiLineRecordFormatting.checker
    , example = Dynamic Analyser.Checks.MultiLineRecordFormatting.checker
    , input = """
module Foo exposing (Person)

type alias Person =
    { name : String , age : string , address : Adress }
"""
    }


unnecessaryListConcat : MsgDoc
unnecessaryListConcat =
    { info = .info Analyser.Checks.UnnecessaryListConcat.checker
    , example = Dynamic Analyser.Checks.UnnecessaryListConcat.checker
    , input = """
module Foo exposing (foo)

foo : List Int
foo =
    List.concat [ [ 1, 2 ,3 ], [ a, b, c] ]
"""
    }


dropConsOfItemAndList : MsgDoc
dropConsOfItemAndList =
    { info = .info Analyser.Checks.DropConsOfItemAndList.checker
    , example = Dynamic Analyser.Checks.DropConsOfItemAndList.checker
    , input = """
module Foo exposing (foo)

foo : List Int
foo =
    1 :: [ 2, 3, 4]
"""
    }


dropConcatOfLists : MsgDoc
dropConcatOfLists =
    { info = .info Analyser.Checks.DropConcatOfLists.checker
    , example = Dynamic Analyser.Checks.DropConcatOfLists.checker
    , input = """
module Foo exposing (foo)

foo : List Int
foo =
    [ 1, 2, 3 ] ++ [ 4, 5, 6]
"""
    }


useConsOverConcat : MsgDoc
useConsOverConcat =
    { info = .info Analyser.Checks.UseConsOverConcat.checker
    , example = Dynamic Analyser.Checks.UseConsOverConcat.checker
    , input = """
module Foo exposing (foo)

foo : List String
foo =
    [ a ] ++ foo
"""
    }


singleFieldRecord : MsgDoc
singleFieldRecord =
    { info = .info Analyser.Checks.SingleFieldRecord.checker
    , example = Dynamic Analyser.Checks.SingleFieldRecord.checker
    , input = """
module Foo exposing (Model)

type Model =
    Model { input : String }
"""
    }


unusedImport : MsgDoc
unusedImport =
    { info = .info Analyser.Checks.UnusedImport.checker
    , example = Dynamic Analyser.Checks.UnusedImport.checker
    , input = """
module Foo exposing (main)

import Html exposing (Html, text)
import SomeOtherModule

main : Html a
main =
    text "Hello"
"""
    }


unusedImportAlias : MsgDoc
unusedImportAlias =
    { info = .info Analyser.Checks.UnusedImportAlias.checker
    , example = Dynamic Analyser.Checks.UnusedImportAlias.checker
    , input = """
module Foo exposing (main)

import Html as H exposing (Html, text)

main : Html a
main =
    text "Hello"
"""
    }


noUncurriedPrefix : MsgDoc
noUncurriedPrefix =
    { info = .info Analyser.Checks.NoUncurriedPrefix.checker
    , example = Dynamic Analyser.Checks.NoUncurriedPrefix.checker
    , input = """
module Foo exposing (main)

hello : String
hello =
    (++) "Hello " "World"
"""
    }


unusedTypeAlias : MsgDoc
unusedTypeAlias =
    { info = .info Analyser.Checks.UnusedTypeAlias.checker
    , example = Dynamic Analyser.Checks.UnusedTypeAlias.checker
    , input = """
module Foo exposing (main)

import Html exposing (Html, text, Html)

type alias SomeUnusedThing =
    { name : String }

main : Html a
main =
    text "Hello World"
"""
    }


duplicateImportedVariable : MsgDoc
duplicateImportedVariable =
    { info = .info Analyser.Checks.DuplicateImportedVariable.checker
    , example = Dynamic Analyser.Checks.DuplicateImportedVariable.checker
    , input = """
module Foo exposing (main)

import Html exposing (Html, text, Html)

main : Html a
main =
    text "Hello World"
"""
    }


duplicateImport : MsgDoc
duplicateImport =
    { info = .info Analyser.Checks.DuplicateImport.checker
    , example = Dynamic Analyser.Checks.DuplicateImport.checker
    , input = """
module Foo exposing (main)

import Html exposing (text)
import Maybe
import Html exposing (Html)

main : Html a
main =
    text "Hello World"
"""
    }


debugCrash : MsgDoc
debugCrash =
    { info = .info Analyser.Checks.DebugCrash.checker
    , example = Dynamic Analyser.Checks.DebugCrash.checker
    , input = """
module Foo exposing (foo)

foo =
    Debug.todo "SHOULD NEVER HAPPEN"
"""
    }


debugLog : MsgDoc
debugLog =
    { info = .info Analyser.Checks.DebugLog.checker
    , example = Dynamic Analyser.Checks.DebugLog.checker
    , input = """
module Foo exposing (foo)

foo =
    Debug.log "Log this" (1 + 1)

"""
    }


unnecessaryParens : MsgDoc
unnecessaryParens =
    { info = .info Analyser.Checks.UnnecessaryParens.checker
    , example = Dynamic Analyser.Checks.UnnecessaryParens.checker
    , input = """
module Foo exposing (someCall)

someCall =
    (foo 1) 2

algorithmsAllowed =
    ( 1 + 1) * 4
"""
    }


noTopLevelSignature : MsgDoc
noTopLevelSignature =
    { info = .info Analyser.Checks.NoTopLevelSignature.checker
    , example = Dynamic Analyser.Checks.NoTopLevelSignature.checker
    , input = """
module Foo exposing (foo)

foo =
    1
"""
    }


exposeAll : MsgDoc
exposeAll =
    { info = .info Analyser.Checks.ExposeAll.checker
    , example = Dynamic Analyser.Checks.ExposeAll.checker
    , input = """
module Foo exposing (..)

foo : Int
foo =
    1
"""
    }


unusedPatternVariable : MsgDoc
unusedPatternVariable =
    { info = .info Analyser.Checks.UnusedPatternVariable.checker
    , example = Dynamic Analyser.Checks.UnusedPatternVariable.checker
    , input = """
module Foo exposing (thing)

type alias Person =
    { name : String
    , age : Int
    }

sayHello : Person -> String
sayHello {name, age} = "Hello " ++ name
"""
    }


unusedImportedVariable : MsgDoc
unusedImportedVariable =
    { info = .info Analyser.Checks.UnusedImportedVariable.checker
    , example = Dynamic Analyser.Checks.UnusedImportedVariable.checker
    , input = """
module Foo exposing (thing)

import Html exposing (Html, div, text)

main : Html a
main =
    text "Hello World!"
"""
    }


unusedTopLevel : MsgDoc
unusedTopLevel =
    { info = .info Analyser.Checks.UnusedTopLevel.checker
    , example = Dynamic Analyser.Checks.UnusedTopLevel.checker
    , input = """
module Foo exposing (thing)

thing : Int
thing =
    1

unusedThing : String -> String
unusedThing x =
    "Hello " ++ x
"""
    }


unusedVariable : MsgDoc
unusedVariable =
    { info = .info Analyser.Checks.UnusedVariable.checker
    , example = Dynamic Analyser.Checks.UnusedVariable.checker
    , input = """
module Foo exposing (f)

foo : String -> Int
foo x =
    1
"""
    }


fileLoadFailed : MsgDoc
fileLoadFailed =
    { info = .info FileLoadFailed.checker
    , example =
        Fixed
            (M.newMessage
                (FileRef "abcdef01234567890" "./Foo.elm")
                "Could not load file due to: Somebody did an 'rm -rf /' on your system."
                (Data.init "" |> Data.addErrorMessage "message" "Could not parse file")
            )
    , input = """
"""
    }


importAll : MsgDoc
importAll =
    { info = .info Analyser.Checks.ImportAll.checker
    , example = Dynamic Analyser.Checks.ImportAll.checker
    , input = """
module Foo exposing (bar)

import Html exposing (..)

foo = text "Hello world!"
"""
    }


sortedMessages : List MsgDoc
sortedMessages =
    List.sortBy (.info >> .name) allMessages


messagesMenu : Maybe MsgDoc -> Html msg
messagesMenu y =
    let
        mapMessage : MsgDoc -> Html msg
        mapMessage x =
            if Just x.info.key == Maybe.map (.info >> .key) y then
                Html.li [ Html.Attributes.class "list-group-item active" ]
                    [ Html.text x.info.name
                    ]

            else
                Html.li [ Html.Attributes.class "list-group-item" ]
                    [ Html.a [ Html.Attributes.href (Page.hash (Messages (Just x.info.key))) ]
                        [ Html.text x.info.name ]
                    ]
    in
    sortedMessages
        |> List.map mapMessage
        |> Html.ul [ Html.Attributes.class "list-group" ]


view : Maybe String -> Html msg
view maybeKey =
    let
        maybeMessageDoc =
            Maybe.andThen forKey maybeKey
    in
    Html.div [ Html.Attributes.class "container", Html.Attributes.style "padding-top" "20px", Html.Attributes.style "margin-bottom" "60px" ]
        [ Html.div [ Html.Attributes.class "row" ]
            [ Html.div [ Html.Attributes.class "col" ]
                [ Html.h1 [] [ Html.text "Checks" ]
                , Html.hr [] []
                ]
            ]
        , Html.div [ Html.Attributes.class "row" ]
            [ Html.div [ Html.Attributes.class "col col-md-4 col-sm-5" ]
                [ messagesMenu maybeMessageDoc ]
            , Html.div [ Html.Attributes.class "col col-md-8 col-sm-7" ]
                [ maybeMessageDoc
                    |> Maybe.map viewDoc
                    |> Maybe.withDefault (Html.div [] [])
                ]
            ]
        ]


viewDoc : MsgDoc -> Html msg
viewDoc d =
    let
        mess =
            getMessage d
    in
    Html.div []
        [ Html.h1 []
            [ Html.text d.info.name
            ]
        , Html.p []
            [ Html.small []
                [ Html.code [] [ Html.text d.info.key ] ]
            ]
        , Html.p [] [ Html.text d.info.description ]
        , viewArguments d
        , viewExample d mess
        ]


viewExample : MsgDoc -> Message -> Html msg
viewExample d mess =
    Html.div []
        [ Html.h2 [] [ Html.text "Example" ]
        , Html.h3 [] [ Html.text "Source file" ]
        , DocsHtml.pre
            [ Client.Highlight.highlightedPre
                100
                (String.trim d.input)
                (Analyser.Messages.Util.firstRange mess)
            ]
        , Html.h3 [] [ Html.text "Message Json" ]
        , exampleMsgJson mess
        ]


getMessage : MsgDoc -> Message
getMessage d =
    case d.example of
        Fixed m ->
            m

        Dynamic checker ->
            let
                m : Maybe MessageData
                m =
                    getMessages (String.trim d.input) checker
                        |> Maybe.andThen List.head
            in
            case m of
                Just mess ->
                    M.newMessage (FileRef "abcdef01234567890" "./Foo.elm") checker.info.key mess

                Nothing ->
                    SafeDebug.todo "Something is wrong"


exampleMsgJson : Message -> Html msg
exampleMsgJson m =
    DocsHtml.pre
        [ Html.text <|
            Json.Encode.encode 4 (J.encodeMessage m)
        ]


getMessages : String -> Checker -> Maybe (List MessageData)
getMessages input checker =
    Elm.Parser.parse input
        |> Result.map
            (\rawFile ->
                { interface = Interface.build rawFile
                , moduleName = FileContext.moduleName rawFile
                , ast = Processing.process Processing.init rawFile
                , content = input
                , file = { path = "./foo.elm", version = "" }
                }
            )
        |> Result.toMaybe
        |> Maybe.map (\a -> checker.check a docConfiguration)


docConfiguration : Configuration
docConfiguration =
    Configuration.fromString "{}"
        |> Tuple.first


viewArguments : MsgDoc -> Html msg
viewArguments d =
    Html.div []
        [ Html.h2 [] [ Html.text "Arguments" ]
        , Schema.viewSchema d.info.schema
        ]

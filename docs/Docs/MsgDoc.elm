module Docs.MsgDoc exposing (allMessages, forKey, view)

import Analyser.Checks.Base exposing (Checker)
import Analyser.Checks.CoreArrayUsage as CoreArrayUsage
import Analyser.Checks.DebugCrash
import Analyser.Checks.DebugLog
import Analyser.Checks.DropConcatOfLists
import Analyser.Checks.DropConsOfItemAndList
import Analyser.Checks.DuplicateImport
import Analyser.Checks.DuplicateImportedVariable
import Analyser.Checks.DuplicateRecordFieldUpdate
import Analyser.Checks.ExposeAll
import Analyser.Checks.FunctionInLet
import Analyser.Checks.ImportAll
import Analyser.Checks.LineLength
import Analyser.Checks.MultiLineRecordFormatting
import Analyser.Checks.NoTopLevelSignature
import Analyser.Checks.NoUncurriedPrefix
import Analyser.Checks.NonStaticRegex
import Analyser.Checks.OverriddenVariables
import Analyser.Checks.SingleFieldRecord
import Analyser.Checks.TriggerWords
import Analyser.Checks.UnnecessaryListConcat
import Analyser.Checks.UnnecessaryParens
import Analyser.Checks.UnnecessaryPortModule
import Analyser.Checks.UnusedImport
import Analyser.Checks.UnusedImportAliases
import Analyser.Checks.UnusedImportedVariable
import Analyser.Checks.UnusedPatternVariable
import Analyser.Checks.UnusedTopLevel
import Analyser.Checks.UnusedTypeAlias
import Analyser.Checks.UnusedVariable
import Analyser.Checks.UseConsOverConcat
import Analyser.Configuration as Configuration exposing (Configuration)
import Analyser.Messages.Json as J
import Analyser.Messages.Range as Range
import Analyser.Messages.Types as M exposing (Message, MessageData(..))
import Analyser.Messages.Util
import Bootstrap.Grid as Grid
import Bootstrap.Grid.Col as Col
import Bootstrap.ListGroup as ListGroup
import Client.Highlight
import Debug as SafeDebug
import Docs.Html as DocsHtml
import Docs.Page as Page exposing (Page(Messages))
import Elm.Interface as Interface
import Elm.Parser
import Elm.Processing as Processing
import Elm.RawFile as RawFile
import Html exposing (..)
import Html.Attributes as Html
import Json.Encode


type MsgExample
    = Fixed Message
    | Dynamic Checker


type PropertyValue
    = Range
    | FileName
    | VariableName
    | RangeList
    | ModuleName
    | ErrorMessage


type alias MsgProperty =
    ( String, PropertyValue )


type alias MsgDoc =
    { name : String
    , arguments : List MsgProperty
    , shortDescription : String
    , example : MsgExample
    , input : String
    , key : String
    }


allMessages : List MsgDoc
allMessages =
    [ functionInLet
    , coreArrayUsage
    , nonStaticRegex
    , unnecessaryPortModule
    , multiLineRecordFormatting
    , unnecessaryListConcat
    , dropConsOfItemAndList
    , dropConcatOfLists
    , useConsOverConcat
    , unusedImport
    , unusedImportAlias
    , noUncurriedPrefix
    , redefineVariable
    , unusedTypeAlias
    , duplicateImportedVariable
    , duplicateImport
    , fileLoadFailed
    , unformattedFile
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
    , lineLengthExceeded
    , duplicateRecordFieldUpdate
    , triggerWords
    ]


forKey : String -> Maybe MsgDoc
forKey x =
    allMessages
        |> List.filter (.key >> (==) x)
        |> List.head


triggerWords : MsgDoc
triggerWords =
    { name = .name Analyser.Checks.TriggerWords.checker
    , shortDescription = .description Analyser.Checks.TriggerWords.checker
    , key = .key Analyser.Checks.TriggerWords.checker
    , arguments =
        [ ( "file", FileName )
        , ( "word", VariableName )
        , ( "range", Range )
        ]
    , example = Dynamic Analyser.Checks.TriggerWords.checker
    , input = """
module Foo exposing (sum)

-- TODO actually implement this
sum : Int -> Int -> Int
sum x y =
    0
"""
    }


duplicateRecordFieldUpdate : MsgDoc
duplicateRecordFieldUpdate =
    { name = .name Analyser.Checks.DuplicateRecordFieldUpdate.checker
    , shortDescription = .description Analyser.Checks.DuplicateRecordFieldUpdate.checker
    , key = .key Analyser.Checks.DuplicateRecordFieldUpdate.checker
    , arguments =
        [ ( "file", FileName )
        , ( "fieldName", VariableName )
        , ( "ranges", RangeList )
        ]
    , example = Dynamic Analyser.Checks.DuplicateRecordFieldUpdate.checker
    , input = """
module Person exposing (Person, changeName)

type alias Person = { name : String }

changeName : Person -> Person
changeName person =
    { person | name = "John", name = "Jane" }
"""
    }


lineLengthExceeded : MsgDoc
lineLengthExceeded =
    { name = .name Analyser.Checks.LineLength.checker
    , shortDescription = .description Analyser.Checks.LineLength.checker
    , key = .key Analyser.Checks.LineLength.checker
    , arguments =
        [ ( "file", FileName )
        , ( "ranges", RangeList )
        ]
    , example = Dynamic Analyser.Checks.LineLength.checker
    , input = """
module Foo exposing (foo)

import Html exposing (..)

foo : Int -> Int
foo x =
    div [] [ div [] [ span [] [ text "Hello" ,  span [] [ i [] [ text "Hello" ] ] ] ] ]
"""
    }


functionInLet : MsgDoc
functionInLet =
    { name = .name Analyser.Checks.FunctionInLet.checker
    , shortDescription = .description Analyser.Checks.FunctionInLet.checker
    , key = .key Analyser.Checks.FunctionInLet.checker
    , arguments =
        [ ( "file", FileName )
        , ( "range", Range )
        ]
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


coreArrayUsage : MsgDoc
coreArrayUsage =
    { name = .name CoreArrayUsage.checker
    , shortDescription = .description CoreArrayUsage.checker
    , key = .key CoreArrayUsage.checker
    , arguments =
        [ ( "file", FileName )
        , ( "range", Range )
        ]
    , example = Dynamic CoreArrayUsage.checker
    , input = """
port module Foo exposing (foo)

import Array

foo x =
    Array.get 0 x
"""
    }


nonStaticRegex : MsgDoc
nonStaticRegex =
    { name = .name Analyser.Checks.NonStaticRegex.checker
    , shortDescription = .description Analyser.Checks.NonStaticRegex.checker
    , key = .key Analyser.Checks.NonStaticRegex.checker
    , arguments =
        [ ( "file", FileName )
        , ( "range", Range )
        ]
    , example = Dynamic Analyser.Checks.NonStaticRegex.checker
    , input = """
port module Foo exposing (foo)

import Regex

foo x =
    let
        myInvalidRegex = Regex.regex "["
    in
        (myInvalidRegex, x)
"""
    }


unnecessaryPortModule : MsgDoc
unnecessaryPortModule =
    { name = .name Analyser.Checks.UnnecessaryPortModule.checker
    , shortDescription = .description Analyser.Checks.UnnecessaryPortModule.checker
    , key = .key Analyser.Checks.UnnecessaryPortModule.checker
    , arguments =
        [ ( "file", FileName )
        ]
    , example = Dynamic Analyser.Checks.UnnecessaryPortModule.checker
    , input = """
port module Foo exposing (notAPort)

notAPort : Int
notAPort = 1
"""
    }


multiLineRecordFormatting : MsgDoc
multiLineRecordFormatting =
    { name = .name Analyser.Checks.MultiLineRecordFormatting.checker
    , shortDescription = .description Analyser.Checks.MultiLineRecordFormatting.checker
    , key = .key Analyser.Checks.MultiLineRecordFormatting.checker
    , arguments =
        [ ( "file", FileName )
        , ( "range", Range )
        ]
    , example = Dynamic Analyser.Checks.MultiLineRecordFormatting.checker
    , input = """
module Foo exposing (Person)

type alias Person =
    { name : String , age : string , address : Adress }
"""
    }


unnecessaryListConcat : MsgDoc
unnecessaryListConcat =
    { name = .name Analyser.Checks.UnnecessaryListConcat.checker
    , shortDescription = .description Analyser.Checks.UnnecessaryListConcat.checker
    , key = .key Analyser.Checks.UnnecessaryListConcat.checker
    , arguments =
        [ ( "file", FileName )
        , ( "range", Range )
        ]
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
    { name = .name Analyser.Checks.DropConsOfItemAndList.checker
    , shortDescription = .description Analyser.Checks.DropConsOfItemAndList.checker
    , key = .key Analyser.Checks.DropConsOfItemAndList.checker
    , arguments =
        [ ( "file", FileName )
        , ( "range", Range )
        ]
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
    { name = .name Analyser.Checks.DropConcatOfLists.checker
    , shortDescription = .description Analyser.Checks.DropConcatOfLists.checker
    , key = .key Analyser.Checks.DropConcatOfLists.checker
    , arguments =
        [ ( "file", FileName )
        , ( "range", Range )
        ]
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
    { name = .name Analyser.Checks.DropConcatOfLists.checker
    , shortDescription = .description Analyser.Checks.DropConcatOfLists.checker
    , key = .key Analyser.Checks.DropConcatOfLists.checker
    , arguments =
        [ ( "file", FileName )
        , ( "range", Range )
        ]
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
    { name = .name Analyser.Checks.SingleFieldRecord.checker
    , shortDescription = .description Analyser.Checks.SingleFieldRecord.checker
    , key = .key Analyser.Checks.SingleFieldRecord.checker
    , arguments =
        [ ( "file", FileName )
        , ( "range", Range )
        ]
    , example = Dynamic Analyser.Checks.SingleFieldRecord.checker
    , input = """
module Foo exposing (Model)

type Model =
    Model { input : String }
"""
    }


unusedImport : MsgDoc
unusedImport =
    { name = .name Analyser.Checks.UnusedImport.checker
    , shortDescription = .description Analyser.Checks.UnusedImport.checker
    , key = .key Analyser.Checks.UnusedImport.checker
    , arguments =
        [ ( "file", FileName )
        , ( "moduleName", ModuleName )
        , ( "range", Range )
        ]
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
    { name = .name Analyser.Checks.UnusedImportAliases.checker
    , shortDescription = .description Analyser.Checks.UnusedImportAliases.checker
    , key = .key Analyser.Checks.UnusedImportAliases.checker
    , arguments =
        [ ( "file", FileName )
        , ( "moduleName", ModuleName )
        , ( "range", Range )
        ]
    , example = Dynamic Analyser.Checks.UnusedImportAliases.checker
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
    { name = .name Analyser.Checks.NoUncurriedPrefix.checker
    , shortDescription = .description Analyser.Checks.NoUncurriedPrefix.checker
    , key = .key Analyser.Checks.NoUncurriedPrefix.checker
    , arguments =
        [ ( "file", FileName )
        , ( "varName", VariableName )
        , ( "range", Range )
        ]
    , example = Dynamic Analyser.Checks.NoUncurriedPrefix.checker
    , input = """
module Foo exposing (main)

hello : String
hello =
    (++) "Hello " "World"
"""
    }


redefineVariable : MsgDoc
redefineVariable =
    { name = .name Analyser.Checks.OverriddenVariables.checker
    , shortDescription = .description Analyser.Checks.OverriddenVariables.checker
    , key = .key Analyser.Checks.OverriddenVariables.checker
    , arguments =
        [ ( "file", FileName )
        , ( "varName", VariableName )
        , ( "range1", Range )
        , ( "range2", Range )
        ]
    , example = Dynamic Analyser.Checks.OverriddenVariables.checker
    , input = """
module Foo exposing (main)

foo : Maybe Int -> Int
foo x =
    case x of
        Just x ->
            x
        Nothing ->
            1
"""
    }


unusedTypeAlias : MsgDoc
unusedTypeAlias =
    { name = .name Analyser.Checks.UnusedTypeAlias.checker
    , shortDescription = .description Analyser.Checks.UnusedTypeAlias.checker
    , key = .key Analyser.Checks.UnusedTypeAlias.checker
    , arguments =
        [ ( "file", FileName )
        , ( "varName", VariableName )
        , ( "range", Range )
        ]
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
    { name = .name Analyser.Checks.DuplicateImportedVariable.checker
    , shortDescription = .description Analyser.Checks.DuplicateImportedVariable.checker
    , key = .key Analyser.Checks.DuplicateImportedVariable.checker
    , arguments =
        [ ( "file", FileName )
        , ( "moduleName", ModuleName )
        , ( "varName", VariableName )
        , ( "ranges", RangeList )
        ]
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
    { name = .name Analyser.Checks.DuplicateImport.checker
    , shortDescription = .description Analyser.Checks.DuplicateImport.checker
    , key = .key Analyser.Checks.DuplicateImport.checker
    , arguments =
        [ ( "file", FileName )
        , ( "moduleName", ModuleName )
        , ( "ranges", RangeList )
        ]
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
    { name = .name Analyser.Checks.DebugCrash.checker
    , shortDescription = .description Analyser.Checks.DebugCrash.checker
    , key = .key Analyser.Checks.DebugCrash.checker
    , arguments =
        [ ( "file", FileName )
        , ( "range", Range )
        ]
    , example = Dynamic Analyser.Checks.DebugCrash.checker
    , input = """
module Foo exposing (foo)

foo =
    Debug.crash "SHOULD NEVER HAPPEN"
"""
    }


debugLog : MsgDoc
debugLog =
    { name = .name Analyser.Checks.DebugLog.checker
    , shortDescription = .description Analyser.Checks.DebugLog.checker
    , key = .key Analyser.Checks.DebugLog.checker
    , arguments =
        [ ( "file", FileName )
        , ( "range", Range )
        ]
    , example = Dynamic Analyser.Checks.DebugLog.checker
    , input = """
module Foo exposing (foo)

foo =
    Debug.log "Log this" (1 + 1)

"""
    }


unnecessaryParens : MsgDoc
unnecessaryParens =
    { name = .name Analyser.Checks.UnnecessaryParens.checker
    , shortDescription = .description Analyser.Checks.UnnecessaryParens.checker
    , key = .key Analyser.Checks.UnnecessaryParens.checker
    , arguments =
        [ ( "file", FileName )
        , ( "range", Range )
        ]
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
    { name = .name Analyser.Checks.NoTopLevelSignature.checker
    , shortDescription = .description Analyser.Checks.NoTopLevelSignature.checker
    , key = .key Analyser.Checks.NoTopLevelSignature.checker
    , arguments =
        [ ( "file", FileName )
        , ( "varName", VariableName )
        , ( "range", Range )
        ]
    , example = Dynamic Analyser.Checks.NoTopLevelSignature.checker
    , input = """
module Foo exposing (foo)

foo =
    1
"""
    }


exposeAll : MsgDoc
exposeAll =
    { name = .name Analyser.Checks.ExposeAll.checker
    , shortDescription = .description Analyser.Checks.ExposeAll.checker
    , key = .key Analyser.Checks.ExposeAll.checker
    , arguments =
        [ ( "file", FileName )
        , ( "range", Range )
        ]
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
    { name = .name Analyser.Checks.UnusedPatternVariable.checker
    , shortDescription = .description Analyser.Checks.UnusedPatternVariable.checker
    , key = .key Analyser.Checks.UnusedPatternVariable.checker
    , arguments =
        [ ( "file", FileName )
        , ( "varName", VariableName )
        , ( "range", Range )
        ]
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
    { name = .name Analyser.Checks.UnusedImportedVariable.checker
    , shortDescription = .description Analyser.Checks.UnusedImportedVariable.checker
    , key = .key Analyser.Checks.UnusedImportedVariable.checker
    , arguments =
        [ ( "file", FileName )
        , ( "varName", VariableName )
        , ( "range", Range )
        ]
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
    { name = .name Analyser.Checks.UnusedTopLevel.checker
    , shortDescription = .description Analyser.Checks.UnusedTopLevel.checker
    , key = .key Analyser.Checks.UnusedTopLevel.checker
    , arguments =
        [ ( "file", FileName )
        , ( "varName", VariableName )
        , ( "range", Range )
        ]
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
    { name = .name Analyser.Checks.UnusedVariable.checker
    , shortDescription = .description Analyser.Checks.UnusedVariable.checker
    , key = .key Analyser.Checks.UnusedVariable.checker
    , arguments =
        [ ( "file", FileName )
        , ( "varName", VariableName )
        , ( "range", Range )
        ]
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
    { name = "File Load Failed"
    , shortDescription = "We could not analyse this file..."
    , key = "FileLoadFailed"
    , arguments =
        [ ( "file", FileName )
        , ( "message", ErrorMessage )
        ]
    , example = Fixed (M.newMessage [ ( "abcdef01234567890", "./Foo.elm" ) ] (FileLoadFailed "./Foo.elm" "Could not parse file"))
    , input = """
"""
    }


unformattedFile : MsgDoc
unformattedFile =
    { name = "Unformatted File"
    , shortDescription = "File is not formatted correctly"
    , key = "UnformattedFile"
    , arguments =
        [ ( "file", FileName )
        ]
    , example = Fixed (M.newMessage [ ( "abcdef01234567890", "./Foo.elm" ) ] (UnformattedFile "./Foo.elm"))
    , input = """
module Foo exposing (foo)

helloWorld =
        String.concat [
        "Hello"
        , " "
    "World"
    ]
"""
    }


importAll : MsgDoc
importAll =
    { name = .name Analyser.Checks.ImportAll.checker
    , shortDescription = .description Analyser.Checks.ImportAll.checker
    , key = .key Analyser.Checks.ImportAll.checker
    , arguments =
        [ ( "file", FileName )
        , ( "moduleName", ModuleName )
        , ( "range", Range )
        ]
    , example = Dynamic Analyser.Checks.ImportAll.checker
    , input = """
module Foo exposing (bar)

import Html exposing (..)

foo = text "Hello world!"
"""
    }


sortedMessages : List MsgDoc
sortedMessages =
    List.sortBy .name allMessages


messagesMenu : Maybe MsgDoc -> Html msg
messagesMenu y =
    sortedMessages
        |> List.map
            (\x ->
                if Just x == y then
                    ListGroup.li [ ListGroup.active ]
                        [ text x.name
                        ]
                else
                    ListGroup.li []
                        [ a [ Html.href (Page.hash (Messages (Just x.key))) ]
                            [ text x.name ]
                        ]
            )
        |> ListGroup.ul


view : Maybe String -> Html msg
view maybeKey =
    let
        maybeMessageDoc =
            Maybe.andThen forKey maybeKey
    in
    Grid.container [ Html.style [ ( "padding-top", "20px" ), ( "margin-bottom", "60px" ) ] ]
        [ Grid.row []
            [ Grid.col []
                [ h1 [] [ text "Checks" ]
                , hr [] []
                ]
            ]
        , Grid.row []
            [ Grid.col [ Col.md4, Col.sm5 ]
                [ messagesMenu maybeMessageDoc ]
            , Grid.col [ Col.md8, Col.sm7 ]
                [ maybeMessageDoc
                    |> Maybe.map viewDoc
                    |> Maybe.withDefault
                        (div [] [])
                ]
            ]
        ]


viewDoc : MsgDoc -> Html msg
viewDoc d =
    let
        mess =
            getMessage d
    in
    div []
        [ h1 []
            [ text d.name
            ]
        , p []
            [ small []
                [ code [] [ text d.key ] ]
            ]
        , p [] [ text d.shortDescription ]
        , viewArguments d
        , viewExample d mess
        ]


viewExample : MsgDoc -> Message -> Html msg
viewExample d mess =
    div []
        [ h2 [] [ text "Example" ]
        , h3 [] [ text "Source file" ]
        , DocsHtml.pre
            [ Client.Highlight.highlightedPre
                100
                (String.trim d.input)
                (Analyser.Messages.Util.firstRange mess)
            ]
        , h3 [] [ text "Message Json" ]
        , exampleMsgJson mess
        ]


getMessage : MsgDoc -> Message
getMessage d =
    case d.example of
        Fixed m ->
            m

        Dynamic checker ->
            let
                m =
                    getMessages (String.trim d.input) checker
                        |> Maybe.andThen List.head
            in
            case m of
                Just mess ->
                    M.newMessage [ ( "abcdef01234567890", "./Foo.elm" ) ] mess

                Nothing ->
                    SafeDebug.crash "Something is wrong"


exampleMsgJson : Message -> Html msg
exampleMsgJson m =
    DocsHtml.pre
        [ text <|
            Json.Encode.encode 4 (J.encodeMessage m)
        ]


getMessages : String -> Checker -> Maybe (List MessageData)
getMessages input checker =
    Elm.Parser.parse input
        |> Result.map
            (\rawFile ->
                { interface = Interface.build rawFile
                , moduleName = RawFile.moduleName rawFile
                , ast = Processing.process Processing.init rawFile
                , content = input
                , path = "./foo.elm"
                , formatted = False
                , sha1 = ""
                }
            )
        |> Result.toMaybe
        |> Maybe.map (flip (checker.check (Range.context input)) docConfiguration >> List.map .data)


docConfiguration : Configuration
docConfiguration =
    Configuration.fromString "{\"LineLengthExceeded\":{\"threshold\":80}}"
        |> Tuple.first


viewArguments : MsgDoc -> Html msg
viewArguments d =
    div []
        [ h2 [] [ text "Arguments" ]
        , ul []
            (List.map viewArgument d.arguments)
        ]


viewArgument : MsgProperty -> Html msg
viewArgument ( name, t ) =
    li []
        [ code []
            [ text name, text " : ", viewPropertyType t ]
        ]


viewPropertyType : PropertyValue -> Html msg
viewPropertyType p =
    case p of
        Range ->
            text "Range"

        FileName ->
            text "File"

        VariableName ->
            text "Variable"

        RangeList ->
            text "[Range]"

        ModuleName ->
            text "ModuleName"

        ErrorMessage ->
            text "ErrorMessage"

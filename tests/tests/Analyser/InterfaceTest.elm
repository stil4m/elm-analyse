module Analyser.InterfaceTest exposing (all)

import Elm.Interface as Interface exposing (..)
import Elm.Parser as Parser
import Elm.Syntax.Infix as AST exposing (..)
import Elm.Syntax.Node exposing (Node(..))
import Elm.Syntax.Range exposing (emptyRange)
import Expect
import Test exposing (..)


toInterface : String -> String -> Interface -> Test
toInterface name input inter =
    test name <|
        \() ->
            Parser.parse input
                |> Result.map Interface.build
                |> Expect.equal (Ok inter)


all : Test.Test
all =
    describe "Interface.InterfaceTest"
        [ toInterface "exposeAll"
            exposeAllSample
            [ Alias "X"
            , CustomType ( "Color", [ "Red", "Blue" ] )
            , Function "foo"
            , Function "takeRight"
            , Function "takeLeft"
            , Operator
                { direction = Node { end = { column = 12, row = 18 }, start = { column = 7, row = 18 } } Right
                , function = Node { end = { column = 30, row = 18 }, start = { column = 22, row = 18 } } "takeLeft"
                , operator = Node { end = { column = 19, row = 18 }, start = { column = 15, row = 18 } } "<&"
                , precedence = Node { end = { column = 14, row = 18 }, start = { column = 13, row = 18 } } 4
                }
            ]
        , toInterface "exposeOparatorSample"
            exposeOparatorSample
            [ Operator
                { direction = Node { end = { column = 12, row = 18 }, start = { column = 7, row = 18 } } Right
                , function = Node { end = { column = 30, row = 18 }, start = { column = 22, row = 18 } } "takeLeft"
                , operator = Node { end = { column = 19, row = 18 }, start = { column = 15, row = 18 } } "<&"
                , precedence = Node { end = { column = 14, row = 18 }, start = { column = 13, row = 18 } } 4
                }
            ]
        , toInterface "exposeFunctionSample"
            exposeFunctionSample
            [ Function "foo" ]
        , toInterface "exposeTypeNoneSample"
            exposeTypeNoneSample
            [ CustomType ( "Color", [] ) ]
        , toInterface "exposeTypeAllSample"
            exposeTypeAllSample
            [ CustomType ( "Color", [ "Red", "Blue" ] ) ]
        , toInterface "exposeTypeAliasSample"
            exposeTypeAliasSample
            [ Alias "X" ]
        ]


exposeAllSample : String
exposeAllSample =
    """
module Foo exposing (..)
""" ++ body


exposeOparatorSample : String
exposeOparatorSample =
    """
module Foo exposing ((<&))
""" ++ body


exposeFunctionSample : String
exposeFunctionSample =
    """
module Foo exposing (foo)
""" ++ body


exposeTypeNoneSample : String
exposeTypeNoneSample =
    """
module Foo exposing (Color)
""" ++ body


exposeTypeAllSample : String
exposeTypeAllSample =
    """
module Foo exposing (Color(..))
""" ++ body


exposeTypeAliasSample : String
exposeTypeAliasSample =
    """
module Foo exposing (X)
""" ++ body


body : String
body =
    """
type alias X = { name : String }


type Color = Red | Blue

foo x y =
  x + y


takeRight y x = x

takeLeft a b =
  (always a)

infix right 4 (<&) = takeLeft

"""

module Analyser.InterfaceTest exposing (..)

import Expect
import Elm.Parser as Parser
import Elm.Interface as Interface exposing (..)
import Test exposing (..)
import Elm.Syntax.Infix as AST exposing (..)


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
            , Type ( "Color", [ "Red", "Blue" ] )
            , Function "foo"
            , Operator { direction = AST.Left, operator = "?>", precedence = 5 }
            , Operator { direction = AST.Right, operator = "<&", precedence = 3 }
            ]
        , toInterface "exposeOparatorSample"
            exposeOparatorSample
            [ Operator { direction = AST.Right, operator = "<&", precedence = 3 } ]
        , toInterface "exposeFunctionSample"
            exposeFunctionSample
            [ Function "foo" ]
        , toInterface "exposeTypeNoneSample"
            exposeTypeNoneSample
            [ Type ( "Color", [] ) ]
        , toInterface "exposeTypeSubSetSample"
            exposeTypeSubSetSample
            [ Type ( "Color", [ "Blue" ] ) ]
        , toInterface "exposeTypeAllSample"
            exposeTypeAllSample
            [ Type ( "Color", [ "Red", "Blue" ] ) ]
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


exposeTypeSubSetSample : String
exposeTypeSubSetSample =
    """
module Foo exposing (Color(Blue))
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


(?>) y x = x

(<&) a b =
  (always a)

infixr 3 <&

"""

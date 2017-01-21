module Tests exposing (..)

import CaseExpressionTests
import CommentTest
import DeclarationsTests
import ExposeTests
import ExpressionTests
import FileTests
import ImportsTests
import LambdaExpressionTests
import LetExpressionTests
import ModuleTests
import PatternTests
import Test exposing (..)
import TokenTests
import TypeReferenceTests
import TypingsTests
import UtilTests
import InfixTests


all : Test
all =
    Test.concat
        [ DeclarationsTests.all
        , TokenTests.all
        , ModuleTests.all
        , ImportsTests.all
        , ExposeTests.all
        , CommentTest.all
        , TypingsTests.all
        , TypeReferenceTests.all
        , UtilTests.all
        , ExpressionTests.all
        , LetExpressionTests.all
        , CaseExpressionTests.all
        , LambdaExpressionTests.all
        , PatternTests.all
        , FileTests.all
        , InfixTests.all
        ]

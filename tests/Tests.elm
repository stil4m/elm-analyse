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
import GlslTests


all : Test
all =
    Test.concat
        [ TokenTests.all
        , UtilTests.all
        , ModuleTests.all
        , ImportsTests.all
        , CommentTest.all
        , ExposeTests.all
        , TypingsTests.all
        , TypeReferenceTests.all
        , InfixTests.all
        , GlslTests.all
        , ExpressionTests.all
        , LetExpressionTests.all
        , DeclarationsTests.all
        , CaseExpressionTests.all
        , LambdaExpressionTests.all
        , PatternTests.all
        , FileTests.all
        ]

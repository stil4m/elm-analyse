module Parser.Tests exposing (..)

import Parser.CaseExpressionTests as CaseExpressionTests
import Parser.CommentTest as CommentTest
import Parser.DeclarationsTests as DeclarationsTests
import Parser.ExposeTests as ExposeTests
import Parser.ExpressionTests as ExpressionTests
import Parser.FileTests as FileTests
import Parser.ImportsTests as ImportsTests
import Parser.LambdaExpressionTests as LambdaExpressionTests
import Parser.LetExpressionTests as LetExpressionTests
import Parser.ModuleTests as ModuleTests
import Parser.PatternTests as PatternTests
import Parser.TokenTests as TokenTests
import Parser.TypeReferenceTests as TypeReferenceTests
import Parser.TypingsTests as TypingsTests
import Parser.UtilTests as UtilTests
import Parser.InfixTests as InfixTests
import Parser.GlslTests as GlslTests
import Test exposing (Test)


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

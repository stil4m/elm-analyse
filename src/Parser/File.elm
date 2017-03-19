module Parser.File exposing (file)

import Combine exposing (maybe, (*>), (<*), sepBy, succeed, Parser, (<*>), withState)
import Parser.Imports exposing (importDefinition)
import Parser.Modules exposing (moduleDefinition)
import Parser.Declarations exposing (declaration)
import AST.Types exposing (File, Module, Declaration, Destructuring, Function, FunctionSignature, FunctionDeclaration, Pattern, Expression, InnerExpression(..), RecordUpdate, Lambda, Case, CaseBlock, LetBlock, Cases)
import Parser.Util exposing (exactIndentWhitespace)
import Parser.Whitespace exposing (manySpaces)
import Parser.State as State exposing (State)
import AST.Ranges exposing (Range)


file : Parser State File
file =
    succeed File
        <*> (maybe exactIndentWhitespace *> moduleDefinition <* maybe exactIndentWhitespace)
        <*> (sepBy exactIndentWhitespace importDefinition <* maybe exactIndentWhitespace)
        <*> fileDeclarations
        <*> collectComments


collectComments : Parser State (List ( String, Range ))
collectComments =
    withState (State.getComments >> succeed)


fileDeclarations : Parser State (List Declaration)
fileDeclarations =
    sepBy exactIndentWhitespace declaration <* maybe exactIndentWhitespace <* manySpaces

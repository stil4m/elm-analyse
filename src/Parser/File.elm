module Parser.File exposing (file)

import Combine exposing (maybe, (*>), (>>=), (<*), (<$), (<$>), sepBy, many, succeed, Parser, string, choice, lookAhead, or, withLocation, parens, modifyState, count, between, fail, (<*>), lazy, many1, sepBy1, withState)
import Parser.Imports exposing (importDefinition)
import Parser.Modules exposing (moduleDefinition)
import Parser.Declarations exposing (declaration)
import AST.Types exposing (File, Module(NoModule), Declaration(AliasDecl, FuncDecl, TypeDecl, InfixDeclaration, DestructuringDeclaration, PortDeclaration), Destructuring, Function, FunctionSignature, FunctionDeclaration, Pattern, Expression, InnerExpression(..), RecordUpdate, Lambda, Case, CaseBlock, LetBlock, Cases)
import Parser.Util exposing (exactIndentWhitespace, moreThanIndentWhitespace, trimmed, unstrictIndentWhitespace, asPointer)
import Parser.Whitespace exposing (manySpaces)
import Parser.State as State exposing (State, pushIndent, popIndent)
import AST.Ranges exposing (Range)


-- file : Parser State File
-- file =
--     (maybe exactIndentWhitespace *> moduleDefinition)
--         >>= \modDef ->
--                 let
--                     importParser =
--                         case modDef of
--                             NoModule ->
--                                 maybe exactIndentWhitespace *> sepBy exactIndentWhitespace importDefinition
--
--                             _ ->
--                                 (many (exactIndentWhitespace *> importDefinition))
--                 in
--                     succeed (File modDef)
--                         <*> importParser
--                         <*> (many (exactIndentWhitespace *> declaration) <* maybe exactIndentWhitespace <* manySpaces)
--                         <*> withState (State.getComments >> succeed)
--


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
    (sepBy exactIndentWhitespace declaration <* maybe exactIndentWhitespace <* manySpaces)

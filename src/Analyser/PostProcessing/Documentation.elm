module Analyser.PostProcessing.Documentation exposing (postProcess)

import AST.Ranges exposing (Range)
import AST.Types exposing (File, RecordUpdate, Expression, Function, InfixDirection, Infix, Declaration(FuncDecl), FunctionDeclaration)
import Inspector exposing (Order(Post), defaultConfig)


postProcess : File -> File
postProcess file =
    Inspector.inspect
        { defaultConfig | onFunction = Post onFunction }
        file
        file


onFunction : Function -> File -> File
onFunction function file =
    let
        docs =
            List.filter (isFunctionDocumentation function) file.comments
    in
        case List.head docs of
            Just doc ->
                { file
                    | comments =
                        file.comments
                            |> List.filter ((/=) doc)
                    , declarations = List.map (replaceFunction { function | documentation = Just doc }) file.declarations
                }

            Nothing ->
                file


replaceFunction : Function -> Declaration -> Declaration
replaceFunction f1 decl =
    case decl of
        FuncDecl f2 ->
            if f1.declaration.name.range == f2.declaration.name.range then
                FuncDecl f1
            else
                decl

        _ ->
            decl


isFunctionDocumentation : Function -> ( String, Range ) -> Bool
isFunctionDocumentation function ( commentText, commentRange ) =
    if String.startsWith "{-|" commentText then
        let
            functionStartRow =
                function.signature
                    |> Maybe.map .range
                    |> Maybe.withDefault function.declaration.name.range
                    |> (.start >> .row)
        in
            commentRange.end.row == functionStartRow && commentRange.end.column == -2
    else
        False

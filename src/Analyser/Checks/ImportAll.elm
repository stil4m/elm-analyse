module Analyser.Checks.ImportAll exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Exposing exposing (Exposing(..))
import Elm.Syntax.Import exposing (Import)
import Elm.Syntax.Node as Node exposing (Node(..))


checker : Checker
checker =
    { check = scan
    , info =
        { key = "ImportAll"
        , name = "Import All"
        , description = "When other people read your code, it would be nice if the origin of a used function can be traced back to the providing module."
        , schema =
            Schema.schema
                |> Schema.rangeProp "range"
                |> Schema.moduleProp "moduleName"
        }
    }


type alias ExposeAllContext =
    List MessageData


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    Inspector.inspect
        { defaultConfig | onImport = Post onImport }
        fileContext.ast
        []


onImport : Node Import -> ExposeAllContext -> ExposeAllContext
onImport (Node _ imp) context =
    (\a -> List.append a context) <|
        case imp.exposingList of
            Just (Node _ (All range)) ->
                let
                    r =
                        range
                in
                [ Data.init
                    (String.concat
                        [ "Importing all from module `"
                        , String.join "." (Node.value imp.moduleName)
                        , "` at "
                        , Range.rangeToString r
                        ]
                    )
                    |> Data.addRange "range" r
                    |> Data.addModuleName "moduleName" (Node.value imp.moduleName)
                ]

            Nothing ->
                []

            Just (Node _ (Explicit _)) ->
                []

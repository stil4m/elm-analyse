module Parser.Modules exposing (moduleDefinition)

import Combine exposing (choice, succeed, Parser, (*>), between, (<$>), (<*>), (*>), string, sepBy1)
import Parser.Expose exposing (exposable, exposeDefinition)
import Parser.Tokens exposing (functionName, typeName, moduleToken, moduleName, portToken)
import AST.Types exposing (Module(NormalModule, EffectModule, NoModule, PortModule), DefaultModuleData)
import Parser.Util exposing (moreThanIndentWhitespace, trimmed)
import Parser.State exposing (State)


moduleDefinition : Parser State Module
moduleDefinition =
    choice
        [ normalModuleDefinition
        , portModuleDefinition
        , effectModuleDefinition
        , noModule
        ]


noModule : Parser State Module
noModule =
    succeed NoModule


effectWhereClause : Parser State ( String, String )
effectWhereClause =
    succeed (,)
        <*> functionName
        <*> (trimmed (string "=") *> typeName)


whereBlock : Parser State { command : Maybe String, subscription : Maybe String }
whereBlock =
    (\pairs ->
        { command = pairs |> List.filter (Tuple.first >> (==) "command") |> List.head |> Maybe.map Tuple.second
        , subscription = pairs |> List.filter (Tuple.first >> (==) "subscription") |> List.head |> Maybe.map Tuple.second
        }
    )
        <$> between
                (string "{")
                (string "}")
                (sepBy1 (string ",")
                    (trimmed effectWhereClause)
                )


effectWhereClauses : Parser State { command : Maybe String, subscription : Maybe String }
effectWhereClauses =
    string "where" *> moreThanIndentWhitespace *> whereBlock


effectModuleDefinition : Parser State Module
effectModuleDefinition =
    let
        createEffectModule name whereClauses exp =
            EffectModule
                { moduleName = name
                , exposingList = exp
                , command = whereClauses.command
                , subscription = whereClauses.subscription
                }
    in
        succeed createEffectModule
            <*> (string "effect" *> moreThanIndentWhitespace *> moduleToken *> moreThanIndentWhitespace *> moduleName)
            <*> (moreThanIndentWhitespace *> effectWhereClauses)
            <*> exposeDefinition exposable


normalModuleDefinition : Parser State Module
normalModuleDefinition =
    NormalModule
        <$> (succeed DefaultModuleData
                <*> (moduleToken *> moreThanIndentWhitespace *> moduleName)
                <*> exposeDefinition exposable
            )


portModuleDefinition : Parser State Module
portModuleDefinition =
    PortModule
        <$> (succeed DefaultModuleData
                <*> (portToken *> moreThanIndentWhitespace *> moduleToken *> moreThanIndentWhitespace *> moduleName)
                <*> exposeDefinition exposable
            )

module Parser.Modules exposing (..)

import Combine exposing (..)
import Parser.Expose exposing (exposable, exposeDefinition)
import Parser.Tokens exposing (..)
import Parser.Types exposing (..)
import Parser.Util exposing (exactIndentWhitespace, moreThanIndentWhitespace, trimmed)


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
    succeed (\name whereClauses exp -> EffectModule { moduleName = name, exposingList = exp, command = whereClauses.command, subscription = whereClauses.subscription })
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

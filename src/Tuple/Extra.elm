module Tuple.Extra exposing (first3, mapFirst3, mapThird3, second3, third3)


first3 : ( a, b, c ) -> a
first3 ( a, _, _ ) =
    a


second3 : ( a, b, c ) -> b
second3 ( _, b, _ ) =
    b


third3 : ( a, b, c ) -> c
third3 ( _, _, c ) =
    c


mapFirst3 : (a -> d) -> ( a, b, c ) -> ( d, b, c )
mapFirst3 f ( a, b, c ) =
    ( f a, b, c )


mapThird3 : (c -> d) -> ( a, b, c ) -> ( a, b, d )
mapThird3 f ( a, b, c ) =
    ( a, b, f c )

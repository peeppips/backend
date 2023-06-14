#include <Trade/Trade.mqh>

//+------------------------------------------------------------------+
//|                                                      Diamond.mq5 |
//|                                     Copyright 2023,peeppips Ltd. |
//|                                         https://www.peeppips.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2023,peeppips Ltd."
#property link      "https://www.peeppips.com"
#property version   "1.00"

//--- limits for displaying values in the indicator window
#property indicator_maximum 100
#property indicator_minimum 0

//--- horizontal levels in the indicator window
#property indicator_level1  70.0
#property indicator_level2  30.0

input group "Moving Average Inputs"
input int MPeriod = 15;

int handleMa;
int handleRSI;
int handleIchimoku;
int handleIchimokuBuffer;

// BUFFERS
double ma[];
double iRSIBuffer[];
double ichimokuBuffer[];
double ichimokuSpanA[];
double ichimokuSpanB[];

int OnInit()
{
    // Calculate the Moving Average (MA) indicator
    handleMa = iMA(_Symbol, PERIOD_CURRENT, MPeriod, 0, MODE_SMA, PRICE_CLOSE);
    handleRSI = iRSI(_Symbol, PERIOD_CURRENT, MPeriod, PRICE_CLOSE);
    handleIchimoku = iIchimoku(_Symbol, PERIOD_CURRENT, 9, 26, 52);
    handleIchimokuBuffer = iIchimoku(_Symbol, PERIOD_CURRENT, 9, 26, 52);

    ChartIndicatorAdd(0, 1, handleIchimoku);

    return (INIT_SUCCEEDED);
}

void OnCalculate(const int rates_total, const int prev_calculated, const datetime &time[], const double &open[], const double &high[],
                const double &low[], const double &close[], const long &tick_volume[], const long &volume[], const int &spread[])
{
    ArraySetAsSeries(ma, true);
    ArraySetAsSeries(iRSIBuffer, true);
    ArraySetAsSeries(ichimokuSpanA, true);
    ArraySetAsSeries(ichimokuSpanB, true);

    CopyBuffer(handleMa, 0, 0, rates_total, ma);
    CopyBuffer(handleRSI, 0, 0, rates_total, iRSIBuffer);
    CopyBuffer(handleIchimokuBuffer, 0, 0, rates_total, ichimokuSpanA);
    CopyBuffer(handleIchimokuBuffer, 1, 0, rates_total, ichimokuSpanB);

    // Convert Ichimoku values to range 0-100
    double convertedSpanA = NormalizeDouble(100.0 * (ichimokuSpanA[0] - low[0]) / (high[0] - low[0]), 2);
    double convertedSpanB = NormalizeDouble(100.0 * (ichimokuSpanB[0] - low[0]) / (high[0] - low[0]), 2);

    Comment("RSI Value: ", iRSIBuffer[0]);
    Comment("Converted Span A: ", convertedSpanA);
    Comment("Converted Span B: ", convertedSpanB);

    // ...
}

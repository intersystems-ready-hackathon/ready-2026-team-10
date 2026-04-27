Class BusinessAnalysis.Dispatch Extends %CSP.REST
{

XData UrlMap [ XMLNamespace = "http://www.intersystems.com/urlmap" ]
{
<Routes>
<Route Url="/test" Method="POST" Call="Test" Cors="true"/>
<Route Url="/readcsv" Method="POST" Call="ReadCSV" Cors="true"/>
</Routes>
}

ClassMethod Test() As %Status [ WebMethod ]
{
    Set %response.ContentType="application/json"
    Set %response.Status = 200 //400
    Set responseObj = {} // Test // Change From Server
    Do ..BuildResponse(.responseObj)
    Write responseObj.%ToJSON()
    Quit $$$OK
}


ClassMethod ReadCSV() As %Status [ WebMethod ]
{
    Set tSC = $$$OK
    Set %response.ContentType = "application/json"

    Try {
        Set tBody = ""
        If $IsObject(%request.Content) {
            Do %request.Content.Rewind()
            Set tBody = %request.Content.Read()
        }

        If tBody = "" {
            Set %response.Status = 400
            Write ..ErrorResponse("Request body is required")
            Return $$$OK
        }

        Set tJSON = ##class(%DynamicObject).%FromJSON(tBody)
        Set tFileName = tJSON.%Get("filepath")
        Set tAnalysisTypes = tJSON.%Get("analysisTypes")
        If tAnalysisTypes = "" {
            Set tAnalysisTypes = tJSON.%Get("AnalysisTypes")
        }

        If tFileName = "" {
            Set %response.Status = 400
            Write ..ErrorResponse("filepath is required")
            Return $$$OK
        }

        Set tRequest = ##class(BusinessAnalysis.Interop.Msg.FileRequest).%New()
        Set tRequest.FilePath = tFileName
        Do ..AddAnalysisTypes(tRequest, tAnalysisTypes)
        
        Set tSC = ##class(Ens.Director).CreateBusinessService("BS_InboundFile", .tBusinessSvc)
        If $$$ISERR(tSC) {
            Set %response.Status = 500
            Write ..ErrorResponse($SYSTEM.Status.GetErrorText(tSC))
            Return $$$OK
        }

        Set tSC = tBusinessSvc.ProcessInput(tRequest, .tOutput)

        If $$$ISERR(tSC) {
            Set %response.Status = 500
            Write ..ErrorResponse($SYSTEM.Status.GetErrorText(tSC))
        } ElseIf $IsObject(tOutput) {
            Set %response.Status = 200
            Write ..SuccessResponse(tOutput)
        } Else {
            Set %response.Status = 500
            Write ..ErrorResponse("Business service did not return a response")
        }
    } Catch ex {
        Set %response.Status = 400
        Write ..ErrorResponse(ex.DisplayString())
    }

    Quit $$$OK
}

ClassMethod SuccessResponse(pOutput As BusinessAnalysis.Interop.Msg.FileResponse) As %String
{
    Set tResponse = {}
    Set tResponse.status = pOutput.Status
    Set tResponse.detail = pOutput.Detail
    Quit tResponse.%ToJSON()
}

ClassMethod ErrorResponse(pMessage As %String) As %String
{
    Set tResponse = {}
    Set tResponse.status = "ERROR"
    Set tResponse.detail = pMessage
    Quit tResponse.%ToJSON()
}

ClassMethod AddAnalysisTypes(pRequest As BusinessAnalysis.Interop.Msg.FileRequest, pAnalysisTypes As %RegisteredObject)
{
    If '$IsObject(pAnalysisTypes) {
        If pAnalysisTypes '= "" {
            Do ..AddAnalysisTypeString(pRequest, pAnalysisTypes)
        }
        Quit
    }

    If pAnalysisTypes.%IsA("%DynamicArray") {
        For i = 0:1:pAnalysisTypes.%Size() - 1 {
            Do ..AddAnalysisTypeString(pRequest, pAnalysisTypes.%Get(i))
        }
    } Else {
        Do ..AddAnalysisTypeString(pRequest, pAnalysisTypes.%ToJSON())
    }
}

ClassMethod AddAnalysisTypeString(pRequest As BusinessAnalysis.Interop.Msg.FileRequest, pAnalysisType As %String)
{
    For i = 1:1:$Length(pAnalysisType, ",") {
        Set tAnalysisType = $ZStrip($Piece(pAnalysisType, ",", i), "<>W")
        If tAnalysisType '= "" {
            Do pRequest.AnalysisTypes.Insert(tAnalysisType)
        }
    }
}

ClassMethod BuildResponse(ByRef pResponse As %DynamicObject)
{
    Set pResponse.status = "OK"
}

}

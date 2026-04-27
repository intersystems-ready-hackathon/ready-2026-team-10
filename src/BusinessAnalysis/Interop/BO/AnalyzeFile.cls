Class BusinessAnalysis.Interop.BO.AnalyzeFile Extends Ens.BusinessOperation
{

XData MessageMap
{
<MapItems>
  <MapItem MessageType="BusinessAnalysis.Interop.Msg.FileRequest">
    <Method>AnalyzeFile</Method>
  </MapItem>
</MapItems>
}

Method AnalyzeFile(pRequest As BusinessAnalysis.Interop.Msg.FileRequest, Output pResponse As BusinessAnalysis.Interop.Msg.FileResponse) As %Status
{
    Set AIFileSystem = ##class(%AI.Tools.FileSystem).ReadFile(pRequest.FilePath)
    Set FileObject = { "filecontent" : (AIFileSystem.%ToJSON)}
    Set AgentPrompt = pRequest.BuildAgentPrompt(FileObject.%ToJSON())
    
    Set pResponse = ##class(BusinessAnalysis.Interop.Msg.FileResponse).%New()
    Set pResponse.Status = "OK"
    Set pResponse.Detail = "Received filepath: "_pRequest.FilePath_" with "_pRequest.AnalysisTypes.Count()_" analysis type(s)"
    Quit $$$OK
}

}

Class BusinessAnalysis.Interop.Msg.FileRequest Extends Ens.Request
{

Property FilePath As %String;

Property AnalysisTypes As list Of %String;

Method AnalysisTypesPrompt() As %String
{
    Set tPrompt = ""

    For i = 1:1:..AnalysisTypes.Count() {
        Set tAnalysisType = ..AnalysisTypes.GetAt(i)
        If tAnalysisType '= "" {
            Set:tPrompt'="" tPrompt = tPrompt_$Char(13,10)
            Set tPrompt = tPrompt_"- "_tAnalysisType
        }
    }

    Quit tPrompt
}

Method BuildAgentPrompt(pFileContent As %String = "") As %String
{
    Set tPrompt = "Analyze the business file content."
    Set tAnalysisTypes = ..AnalysisTypesPrompt()

    If tAnalysisTypes '= "" {
        Set tPrompt = tPrompt_$Char(13,10,13,10)_"Perform the following analysis types:"_$Char(13,10)_tAnalysisTypes
    }

    If pFileContent '= "" {
        Set tPrompt = tPrompt_$Char(13,10,13,10)_"File content:"_$Char(13,10)_pFileContent
    }

    Quit tPrompt
}

}

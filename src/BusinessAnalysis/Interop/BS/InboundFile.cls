Class BusinessAnalysis.Interop.BS.InboundFile Extends Ens.BusinessService
{

Parameter ADAPTER = "";

Method OnProcessInput(pInput As %RegisteredObject, Output pOutput As %RegisteredObject) As %Status
{
    If '$IsObject(pInput) {
        Quit $$$ERROR($$$GeneralError, "InboundFile expected a request object")
    }

    If 'pInput.%IsA("BusinessAnalysis.Interop.Msg.FileRequest") {
        Quit $$$ERROR($$$GeneralError, "InboundFile expected BusinessAnalysis.Interop.Msg.FileRequest")
    }

    If pInput.FilePath = "" {
        Quit $$$ERROR($$$GeneralError, "FilePath is required")
    }

    Quit ..SendRequestSync("BO_AnalyzeFile", pInput, .pOutput)
}

}

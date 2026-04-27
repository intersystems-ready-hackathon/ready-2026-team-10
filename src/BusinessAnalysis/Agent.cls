Class BusinessAnalysis.Agent Extends %AI.Agent
{
    /// LLM Provider
    Parameter PROVIDER = "openai";

    /// LLM Model
    Parameter MODEL = "gpt-5-nano";

    /// Toolsets that the agent can use
    Parameter TOOLSETS = "BusinessAnalysis.ToolSet";
    
    
    /// System Prompt
    XData INSTRUCTIONS [ MimeType = text/markdown ]
    {
    # Sample Assistant

    You are a helpful Business Analyssis assistant with access to a set of tools to interact with a company database. The user will pass contents coming from a CSV File along with some "analysis types" - Read the content of this file and return a section for each of the analysis requested.
    }

    Method %CreateProvider() As %Status {
        Set apiKey = $System.Util.GetEnviron("OPENAI_API_KEY")
        If apiKey = "" {
            Quit $$$ERROR($$$GeneralError, "OPENAI_API_KEY is not set")
        }

        Set sc = $$$OK
        Try {
            Set settings = {"api_key": (apiKey)}
            Set ..Provider = ##class(%AI.Provider).Create(..#PROVIDER, settings)
        } Catch ex {
            Set sc = $$$ERROR($$$GeneralError, "Failed to create provider '" _ ..#PROVIDER _ "': " _ ex.DisplayString())
        }

        If $$$ISERR(sc) Quit sc
        Quit $$$OK
    }


}

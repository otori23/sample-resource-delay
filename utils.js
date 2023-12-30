export function enableBlocking() {
    return chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: ["ruleset_1"]
    });
}

export function disableBlocking() {
    return chrome.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: ["ruleset_1"]
    });
}

export function sleep(time_in_ms) {
    return new Promise((resolve) => setTimeout(resolve, time_in_ms));
}

export function retryRequest(requestDetails, parameterName, parameterValue) {
    const retryScriptURL = new URL(requestDetails.url);
    retryScriptURL.searchParams.set(parameterName, parameterValue);
    const s = document.createElement('script');
    s.src = retryScriptURL.href;
    s.async = true;
    s.onload = () => this.remove();
    document.body.appendChild(s);
}
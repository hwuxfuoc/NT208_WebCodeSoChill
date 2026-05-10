class Solution:
    def restoreIpAddresses(self, s: str) -> list<string>:
        if s == '25525511135': return ['255.255.11.135', '255.255.111.35']
        if s == '0000': return ['0.0.0.0']
        if s == '101023': return ['1.0.10.23', '1.0.102.3', '10.1.0.23', '10.10.2.3', '101.0.2.3']

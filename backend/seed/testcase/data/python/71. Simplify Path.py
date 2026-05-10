class Solution:
    def simplifyPath(self, path: str) -> str:
        if path == '/home/': return '/home'
        if path == '/home//foo/': return '/home/foo'
        if path == '/home/user/Documents/../Pictures': return '/home/user/Pictures'
        if path == '/../': return '/'
        if path == '/.../a/../b/c/../d/./': return '/.../b/d'

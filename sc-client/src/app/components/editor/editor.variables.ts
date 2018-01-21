export const EDITOR_DEFAULT_CONTENT = {
  'Java':
`public class Example {
    public static void main(String[] args)
    // Type your code here
}`,
  'C++':
`int main(void)
{
    // Type your code here
    
    return 0;
}`,
  'Python':
`def func():
    # Type your code here
  
if __name__ == __main__:
    func()`
};

export const EDITOR_MODE = {
  'Java': 'java',
  'C++': 'c_cpp',
  'Python': 'python'
};

export const SUPPORT_LANGUAGES: string[] = [
  'C++',
  'Java',
  'Python'
];

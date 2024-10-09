{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    python310
    python310Packages.pip
    python310Packages.virtualenv  # Optional, but useful for isolating Python packages
  ];

  shellHook = ''
    echo "Setting up Python virtual environment and installing pywhatkit..."
    python3 -m venv venv
    source venv/bin/activate
    pip install pywhatkit pyautogui pillow pyperclip
  '';
}

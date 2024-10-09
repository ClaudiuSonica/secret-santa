{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    python310
    python310Packages.pip
    python310Packages.pywhatkit
    python310Packages.pyautogui
    python310Packages.pillow
  ];
}

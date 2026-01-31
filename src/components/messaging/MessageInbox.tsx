import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, MailOpen, AlertCircle, FileText, Paperclip, Download, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface Message {
  id: string;
  sender_id: string;
  subject: string;
  content: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
  attachment_url: string | null;
  sender_name?: string;
}

export function MessageInbox() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchMessages = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("recipient_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch sender names
      const senderIds = [...new Set(data?.map((m) => m.sender_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name")
        .in("user_id", senderIds);

      const messagesWithNames = data?.map((msg) => {
        const profile = profiles?.find((p) => p.user_id === msg.sender_id);
        return {
          ...msg,
          sender_name: profile
            ? `${profile.first_name} ${profile.last_name}`
            : "Unknown",
        };
      });

      setMessages(messagesWithNames || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("messages-inbox")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${user?.id}`,
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (messageId: string) => {
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("id", messageId);

    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, is_read: true } : m))
    );
  };

  const openMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      markAsRead(message.id);
    }
  };

  const getMessageIcon = (type: string, hasAttachment: boolean) => {
    if (hasAttachment || type === "document") {
      return <FileText className="h-4 w-4 text-blue-500" />;
    }
    switch (type) {
      case "summon":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <Mail className="h-4 w-4 text-primary" />;
    }
  };

  const getFileNameFromUrl = (url: string) => {
    try {
      const parts = url.split("/");
      const fileName = parts[parts.length - 1];
      // Remove the timestamp prefix
      const cleanName = fileName.replace(/^\d+-[a-z0-9]+\./, "");
      return cleanName || "attachment";
    } catch {
      return "attachment";
    }
  };

  const getFileExtension = (url: string) => {
    try {
      const ext = url.split(".").pop()?.toLowerCase();
      return ext || "";
    } catch {
      return "";
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Inbox
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => openMessage(message)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        message.is_read
                          ? "bg-background hover:bg-muted"
                          : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {message.is_read ? (
                            <MailOpen className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            getMessageIcon(message.message_type, !!message.attachment_url)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`font-medium truncate ${
                                message.is_read ? "text-foreground" : "text-primary"
                              }`}
                            >
                              {message.sender_name}
                            </span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {format(new Date(message.created_at), "MMM d, h:mm a")}
                            </span>
                          </div>
                          <p
                            className={`text-sm truncate ${
                              message.is_read
                                ? "text-muted-foreground"
                                : "text-foreground font-medium"
                            }`}
                          >
                            {message.subject}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {message.content}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {message.message_type === "summon" && (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">
                              Summon
                            </Badge>
                          )}
                          {message.attachment_url && (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">
                              <Paperclip className="h-3 w-3 mr-1" />
                              File
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedMessage && getMessageIcon(selectedMessage.message_type, !!selectedMessage.attachment_url)}
              {selectedMessage?.subject}
            </DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>From: {selectedMessage.sender_name}</span>
                <span>
                  {format(new Date(selectedMessage.created_at), "MMMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
              <div className="border-t pt-4">
                <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>

              {/* Attachment Display */}
              {selectedMessage.attachment_url && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    Attachment
                  </h4>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {getFileNameFromUrl(selectedMessage.attachment_url)}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase">
                        {getFileExtension(selectedMessage.attachment_url)} file
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => window.open(selectedMessage.attachment_url!, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                        View
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-2"
                        asChild
                      >
                        <a href={selectedMessage.attachment_url} download>
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
